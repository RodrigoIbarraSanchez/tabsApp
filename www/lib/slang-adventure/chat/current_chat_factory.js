'use strict';

angular.module('slangAdventure.currentChatFactory', ['slangAdventure.userFactory', 'slangAdventure.contactsFactory', 'slangAdventure.receivedMessagesAboutToSeen', 'firebase'])

.factory('currentChatFactory', ['userFactory', 'contactsFactory', 'receivedMessagesAboutToSeen', '$firebaseArray', '$firebaseObject',
function(                        userFactory,   contactsFactory,   receivedMessagesAboutToSeen,   $firebaseArray,   $firebaseObject){
    
    var chatsRef = null;

    var theChat = {
        chatId: null,
        chats: [],
        picture: 'https://slangbackend.herokuapp.com/img/dummy.jpg',
        fullName: null,
        //lastSeen: null,
        number: null,
        //status: null
    };

    theChat.setChatInfo = function (chatInfo){
        this.picture = chatInfo.picture;
        this.fullName = chatInfo.fullName;
        //this.lastSeen = chatInfo.lastSeen;
        this.number = chatInfo.number;
        //this.status = chatInfo.status;
    };

    theChat.getChatInfo = function (){
        return {
            picture: this.picture,
            fullName: this.fullName,
            lastSeen: this.lastSeen,
            number: this.number,
            status: this.status
        }
    };

    theChat.clearChatInfo = function (){
        this.picture = 'https://slangbackend.herokuapp.com/img/dummy.jpg';
        this.fullName = null;
        this.lastSeen = null;
        this.number = null;
        this.status = null;
    };

    // Cargar información del(los) contacto(s) con el(los) que se va a chatear
    theChat.loadChatInfo = function (contacts, callback){
        // Limpiar información del contacto
        this.clearChatInfo();

        // Colocar los nuevos valores
        if (contacts.length === 1) {
            this.setChatInfo(contactsFactory.getContactInfoFromNumber(contacts[0]));
        }else{
            contactsFactory.getNamesFromArray(contacts, function (namesInfo){
                theChat.setChatInfo({
                    picture: 'http://res.cloudinary.com/slangvoom/image/upload/v1451724816/lyefirraoz9veqtqaqxe.png',
                    fullName: namesInfo
                });
            });
        }
        
        // Informar que ya se cargó la información
        callback();
    };

    theChat.loadChat = function (chatId, windowDocument, callback){ // windowDocument en foco sirve para ver si está online
        this.chatId = chatId;
        chatsRef = new Firebase('https://slangvoom.firebaseio.com/chats/'+chatId+'/messages');
        this.chats = $firebaseArray(chatsRef);

        this.chats.$loaded().then(function(x) {
            callback();
        })
        .catch(function(error) {
            console.log("Error:", error);
        });

        // Observar si llegan nuevos chats para marcarlos como leídos
        this.chats.$watch(function(event) {
            // Si se cargó un nuevo mensaje y el usuario tiene la ventana en foco, el mensaje se marca como visto
            if ((event.event == 'child_added')) {
                var message = theChat.chats.$getRecord(event.key);
                if (message != null) {
                    if (message.number != userFactory.getNumber()) {
                        if(message.status == 'sent' || message.status == 'received'){
                            if (windowDocument.hasFocus()) {
                                // Marcar como leído si el usuario está activo
                                flagAsSeen(chatId, message.$id);
                            }
                            else{
                                // Mandar a la cola para procesar mas tarde si el usuario no está activo
                                //console.log('Se guarda '+chatId +' y '+ message.$id);
                                receivedMessagesAboutToSeen.addMessage(chatId, message.$id);
                            }
                        }
                    }
                }
            }
        });
    };

    theChat.clear = function (){
        this.chatId = null;
        chatsRef = null;
        this.chats = [];
    };

    theChat.explode = function (message){
        if (message.bomb && message.author == userFactory.getUserId()) {
            this.chats.$remove(message);
        }
    };

    theChat.showBomb = function (message) {
        if (message.bomb && message.author == userFactory.getUserId()) {
            return true;
        }
        else{
            return false;
        }
    };

    return theChat;

    // Marcar mensaje como visto
    function flagAsSeen(chatId, messageId){

        var messageRef = new Firebase('https://slangvoom.firebaseio.com/chats/'+chatId+'/messages/'+messageId+'/status');
        
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
                    // console.log('Status cambiado exitosamente');
                }, function(error) {
                    console.log("Error:", error);
                });
            }
        });
    }

}]);



