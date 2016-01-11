'use strict';

angular.module('slangAdventure.chatService', ['firebase', 'slangAdventure.userFactory', 'slangAdventure.newMessageFactory', 'slangAdventure.currentChatFactory', 'slangAdventure.sendingMessages'])

.service('chatService', ['$http', 'userFactory', 'newMessageFactory', 'currentChatFactory', 'sendingMessages', '$firebaseObject', '$firebaseArray', '$firebaseAuth',
function(                 $http,   userFactory,   newMessageFactory,   currentChatFactory,   sendingMessages,   $firebaseObject,   $firebaseArray,   $firebaseAuth) {

	// Obtener lista de contactos de firebase desde un chatId
	this.getNumbersFromChatId = function (chatId, callback){
		var usersRef = new Firebase("https://slangvoom.firebaseio.com/chats/"+chatId+'/users');

		// create an instance of the authentication service
		var auth = $firebaseAuth(usersRef);
		// login with Custom Token
		auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
			// console.log("Logged in as:", authData.uid);
			// Cargar lista de los chats del usuario desde firebase
			var users = $firebaseArray(usersRef);

			var numberList = [];

			// Avisar que ya cargaron los chats y así poder mostrar los contactos
			users.$loaded().then(function(){
		        for (var i = users.length - 1; i >= 0; i--) {
		        	numberList.push(users[i].$value);
		        };
		        callback(numberList);
		    });

		}).catch(function(error) {
			console.log("Authentication failed:", error);
			return [];
		});
	}

	// Obtener lista de chats de firebase
	this.getChats = function (callback, ready){

		var userChats = new Firebase("https://slangvoom.firebaseio.com/users/"+userFactory.getUserId()+"/chats");

		// create an instance of the authentication service
		var auth = $firebaseAuth(userChats);
		// login with Custom Token
		auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
			// console.log("Logged in as:", authData.uid);
			// Cargar lista de los chats del usuario desde firebase
			var chats = $firebaseArray(userChats);

			// Avisar que ya cargaron los chats y así poder mostrar los contactos
			chats.$loaded().then(function(){
		        ready();
		    });

			// Revisar si hay chats nuevos
			chats.$watch(function(event) {
				var chatList = [];
		    	angular.forEach(chats, function (chat){
		    		// Obtener último mensaje del chat
		    		getLastChatMessage (chat, function (chat, messages){
		    			chatList.push({chatBasic: chat, chatComplete: messages});
		    		});
		    	});
		    	// Retornar la información de los chats al invocador
				callback(chatList);
			});

		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	};

	// Enviar un mensaje nuevo contenido en newMessageFactory
	this.sendChatMessage = function (recargarChat){
		// Obtener el mensaje
		var newMessage = newMessageFactory.getMessage();

		// Limpiar contenido del mensaje
		newMessageFactory.clearMessageContent();

		// Checar método de envío
		if (newMessage.isNewChat) { // Enviar por API

			// Codigo especial de mensaje enviandose
			var sendingCode = guid();
			sendingMessages.list.push(sendingCode);

			// Actualizar lista de chats con un mensaje que no se ha enviado
			currentChatFactory.chats.push({
				author: userFactory.getUserId(),
				number: userFactory.getNumber(),
				bomb: false,
				content: newMessage.content,
				type: newMessage.type,
				sendingCode: sendingCode
			});

	        // Ejecutando API
	        $http.post('https://slangbackend.herokuapp.com/api/users/'+userFactory.getNumber()+'/chats?access_token='+userFactory.getAccessToken(), newMessage).then(
	            function(response){

	            	var newChatId = response.data;
	            	newMessageFactory.setMessage(newChatId, false); // Los nuevos mensajes ya no pasan por el api sino por firebase
	                newMessageFactory.isSending = false;
	                
	                recargarChat(newChatId, function (){
	                	sendingMessages.list.splice(sendingMessages.list.indexOf(sendingCode), 1);
	                });
	            },
	            function(e){
	            	alert('Algo salió mal u.u');
	            }
	        );
		}
		else{ // Enviar por firebase
			newMessageFactory.isSending = false;


			// Codigo especial de mensaje enviandose
			var sendingCode = guid();
			sendingMessages.list.push(sendingCode);

			// Enviar por firebase
			currentChatFactory.chats.$add({
				author: userFactory.getUserId(),
				number: userFactory.getNumber(),
				bomb: newMessage.hasBomb,
				content: newMessage.content,
				type: newMessage.type,
				createdAt: Firebase.ServerValue.TIMESTAMP,
				sendingCode: sendingCode,
				status: 'sent'
			}).then(function(ref) {
				// Borrar de la lista de mensajes enviandose el que ya se envió
				sendingMessages.list.splice(sendingMessages.list.indexOf(sendingCode), 1);
				// Recargar chats
				//recargarChat(newMessage.chatId, function(){});
			});
		}
	};

	// Obtener el último mensaje de un chat y marcarlo como recibido
	function getLastChatMessage (chat, callback){

		var lastMessageRef = new Firebase('https://slangvoom.firebaseio.com/chats/'+chat.chatId+'/messages');

		// create an instance of the authentication service
		var auth = $firebaseAuth(lastMessageRef);
		// login with Custom Token
		auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
			// console.log("Logged in as:", authData.uid);
			// Cargar lista del último mensaje
			var messages = $firebaseArray(lastMessageRef.limitToLast(1));
			// Retornar la información sobre el último mensaje
			messages.$loaded().then(function(){
				// Retornar el último mensaje
		        callback(chat, messages);
		    });
		    // Revisar si hay mensajes nuevos y si sí, se marcan como leídos
		    messages.$watch(function(event) {
				// Marcar mensaje como recibido si no es mío
				if (messages[0] != null ) {
					if (messages[0].number != userFactory.getNumber() && messages[0].status == 'sent') {
						flagChatAsReceived(chat.chatId);
						//flagAsReceived(chat.chatId, messages[0].$id);
					}
				}
			});
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	}

	// Marcar todo un chat como recibido
	function flagChatAsReceived(chatId){
		var chatRef = new Firebase('https://slangvoom.firebaseio.com/chats/'+chatId+'/messages');

		// create an instance of the authentication service
		var auth = $firebaseAuth(chatRef);
		// login with Custom Token
		auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
			// Cargar mensaje
			var chat = $firebaseArray(chatRef);
			// Obtener la información sobre el mensaje y marcar como recibido
			chat.$loaded().then(function(){
				angular.forEach(chat, function (message){
		    		if (message.status == 'sent') {
		    			flagAsReceived(chatId, message.$id);
		    		}
		    	});
		    });
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	}

	// Marcar mensaje como recibido
	function flagAsReceived(chatId, messageId){

		var messageRef = new Firebase('https://slangvoom.firebaseio.com/chats/'+chatId+'/messages/'+messageId+'/status');

		// create an instance of the authentication service
		var auth = $firebaseAuth(messageRef);
		// login with Custom Token
		auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
			// Cargar mensaje
			var message = $firebaseObject(messageRef);
			// Obtener la información sobre el mensaje y marcar como recibido
			message.$loaded().then(function(){
				// Solo los mensajes que estan marcados como sent se actualizan
				if (message.$value == 'sent') {
					// Cambiar status
					message.$value = 'received';
					// Guardar status
					message.$save().then(function(ref) {
					  	// console.log('Status cambiado exitosamente');
					}, function(error) {
					  	console.log("Error:", error);
					});
				}
		    });
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});

	}

	// ID de mensajes no enviados
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}

}]);