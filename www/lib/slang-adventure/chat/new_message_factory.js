'use strict';

angular.module('slangAdventure.newMessageFactory', [])

.factory('newMessageFactory', [function(){

    var isNewChat = true;
    var toNumber = null;
    var chatId = null;
    var toGroup = [];
    var isGroup = false;

    var newMessage = {
        type: 'text',
        hasBomb: false,
        content: '',
        isSending: false,
    };

    // Devolver un objeto mensaje
    newMessage.getMessage = function (){
        var message = {
            isNewChat: isNewChat,
            type: newMessage.type,
            hasBomb: newMessage.hasBomb,
            content: newMessage.content
        };

        if (isNewChat && isGroup) {
            message.toGroup = toGroup;
        }
        else if(isNewChat){
            message.toNumber = toNumber;
        }
        else{
            message.chatId = chatId;
        }

        return message;
    };

    // Settear un nuevo mensaje para definir a quién se le va a mandar y si es un chat nuevo o existente
    newMessage.setMessage = function (setTo, setIsNew){
        // ECMASCRIPT 5 no permite predefinirlos antes u.u
        setIsNew = typeof setIsNew !== 'undefined' ? setIsNew : false;

        // Se resetea el mensaje por si las flies
        this.clearMessage();

        // Si es nuevo chat
        if (setIsNew && setTo.length === 1) {
            isNewChat = true;
            chatId = null;
            toNumber = setTo[0];
            isGroup = false;
            toGroup = [];
        }
        else if(setIsNew){
            isNewChat = true;
            chatId = null;
            toNumber = null;
            toGroup = setTo;
            isGroup = true;
        }
        // Si el chat ya existía
        else{
            isNewChat = false;
            toNumber = null;
            toGroup = [];
            chatId = setTo;
            isGroup = false;
        }
    };

    // Crear un nuevo mensaje
    newMessage.createMessage = function (setContent, setHasBomb, setType){
        // ECMASCRIPT 5 no permite predefinirlos antes u.u
        setType = typeof setType !== 'undefined' ? setType : 'text';
        setHasBomb = typeof setHasBomb !== 'undefined' ? setHasBomb : false;

        this.content = setContent;
        this.type = setType;
        this.hasBomb = setHasBomb;
    };

    // Resetear todos los valores del mensaje
    newMessage.clearMessage = function (){
        isNewChat = true;
        toNumber = null;
        chatId = null;
        toGroup = [];
        isGroup = false;
        this.content = '';
        this.type = 'text';
        this.hasBomb = false;
    };

    // Resetea el contenido del mensaje
    newMessage.clearMessageContent = function (){
        this.content = '';
        this.type = 'text';
        this.hasBomb = false;
    };
    
    return newMessage;

}]);