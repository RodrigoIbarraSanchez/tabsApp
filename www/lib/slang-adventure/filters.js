'use strict';

angular.module('slangAdventure.filters', ['slangAdventure.contactsFactory', 'slangAdventure.sendingMessages', 'slangAdventure.userFactory'])

.filter('numberToName', ['contactsFactory', function(contactsFactory){
    return function(num) {
        return contactsFactory.getNameFromNum(num);
    };
}])

.filter('chatToName', ['contactsFactory', function(contactsFactory){
    return function(chat) {
        return contactsFactory.getNameFromChat(chat);
    };
}])

.filter('numberToPicture', ['contactsFactory', function(contactsFactory){
    return function(num) {
        return contactsFactory.getPictureFromNumber(num);
    };
}])

.filter('messageClassColor', ['contactsFactory', function(contactsFactory){
    return function(num) {
        return contactsFactory.messageClassColor(num);
    };
}])

.filter('messageClassOrder', ['contactsFactory', function(contactsFactory){
    return function(num) {
        return contactsFactory.messageClassOrder(num);
    };
}])

.filter('showName', ['contactsFactory', function(contactsFactory){
    return function(num) {
        return contactsFactory.showName(num);
    };
}])

.filter('isIndividual', [function(){
    return function(chatName) {
        chatName = Number(chatName);
        return chatName % 1 === 0;
    };
}])

.filter('limitMessage', [function(){
    return function(message) {
        if (message.length > 23) {
            return message.substring(0, 20)+'...';
        }
        else{
            return message;
        }
    };
}])

.filter('showBomb', ['currentChatFactory', function(currentChatFactory){
    return function(chat) {
        return currentChatFactory.showBomb(chat);
    };
}])

.filter('messageStatusIcon', ['sendingMessages', 'userFactory', function(sendingMessages, userFactory){
    return function(chat) {

        // Los iconos de enviando, recibido, visto, etc. solo aparecen en mis mensajes
        if (chat.number == userFactory.getNumber()) {

            if (sendingMessages.list.indexOf(chat.sendingCode) != -1) {
                return '<i class="fa statusMessageNotRead fa-clock-o"></i>';
            }
            else{
                switch(chat.status) {
                    case 'sent':
                        return '<i class="fa statusMessageNotRead fa-check"></i>';
                        break;
                    case 'received':
                        return '<span class="doubleCheck"><i class="fa statusMessageNotRead fa-check"></i><i class="fa statusMessageNotRead fa-check"></i></span>';
                    case 'seen':
                        return '<span class="doubleCheck"><i class="fa statusMessageRead fa-check"></i><i class="fa statusMessageRead fa-check"></i></span>';
                    default:
                        return '';
                }
            }
        }

    };
}])

.filter('lastSeenText', ['moment', function(moment){
    return function(timeAgo) {
        if (timeAgo == "hace unos segundos") {
            return 'Activo(a) en SlangVoom'
        }
        else if(timeAgo == ''){
            return 'Haz clic aquí para información de contacto';
        }
        else{
            return 'Activo(a) '+ timeAgo;
        }
    };
}]);
