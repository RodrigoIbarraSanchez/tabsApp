'use strict';

angular.module('slangAdventure.receivedMessagesAboutToSeen', ['firebase', 'slangAdventure.userFactory'])

.factory('receivedMessagesAboutToSeen', ['$firebaseObject', '$firebaseAuth', 'userFactory', function($firebaseObject, $firebaseAuth, userFactory){
    
    var messages = [];

    var thisFactory = {};

    thisFactory.addMessage = function (chatId, messageId){
        messages.push({chatId: chatId, messageId: messageId});
    };

    // Procesar cola de mensajes que llegaron pero no se marcaron como vistos porque el usuario no estaba activo hasta ahora
    thisFactory.processSeenMessages = function (){
        if (messages.length > 0) {
            angular.forEach(messages, function (message, index){
                // console.log('Se va a procesar el chat: '+ message.chatId+': mensaje: '+message.messageId);
                flagAsSeen(message.chatId, message.messageId, function(){
                    messages.splice(index, 1);
                });
            });
        }
    };

    return thisFactory;

    // Marcar mensaje como visto
    function flagAsSeen(chatId, messageId, callback){

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
                if (message.$value == 'sent' || message.$value == 'received') {
                    // Cambiar status
                    message.$value = 'seen';
                    // Guardar status
                    message.$save().then(function(ref) {
                        callback();
                    }, function(error) {
                        console.log("Error:", error);
                    });
                }
            });

        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    }

}]);
