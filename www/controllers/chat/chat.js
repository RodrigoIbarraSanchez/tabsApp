'use strict';

angular.module('slangApp.chat', ['slangAdventure.contactsService', 'slangAdventure.newMessageFactory', 'slangAdventure.currentChatFactory'])

.controller('chatCtrl', ['$scope', 'chatService', 'newMessageFactory', 'currentChatFactory', '$window',
function(                 $scope,   chatService,   newMessageFactory,   currentChatFactory,   $window) {

    // Ocultar área de chat porque no hay ninguno seleccionado
    $scope.chatAreaShow = false;

    // Cada vez que se escuche la llamada de 'startChat' se inicia un nuevo chat con el número de teléfono agregado y el mensaje mandado
    $scope.$on('startChat', function(event, data){
        // Vaciar el campo de chat
        $scope.chatNewMessageContent = '';

        // Vaciar mensajes del chat
        $scope.chatArea = [];

        // Es chat grupal
        $scope.isGroup = false;

        // Cargar información del contacto con quien se va a chatear
        if (data.number != null) {
            if (!isNumber(data.number) && data.chatId != null) {
                $scope.isGroup = true;
                // OBTENER LISTA DE CONTACTOS A PARTIR DEL CHATID
                chatService.getNumbersFromChatId(data.chatId, function (contacts){
                    currentChatFactory.loadChatInfo(contacts, function(){
                        // Avisar que ya se cargó la información del chat
                        $scope.$emit('pushChangesToAllNodes', {name: 'reloadChatInfo', data: null});
                    });
                });
            }
            else{
                var contacts = [data.number];
                currentChatFactory.loadChatInfo(contacts, function(){
                    // Avisar que ya se cargó la información del chat
                    $scope.$emit('pushChangesToAllNodes', {name: 'reloadChatInfo', data: null});
                });
            }
        }
        else{
            $scope.isGroup = true;
            var contacts = data.contacts;
            currentChatFactory.loadChatInfo(data.contacts, function(){
                // Avisar que ya se cargó la información del chat
                $scope.$emit('pushChangesToAllNodes', {name: 'reloadChatInfo', data: null});
            });
        }

        
        // Si el chat no existe
        if (data.chatId == null) {// El mensaje que se va a mandar es para un chat que todavía no existe y se debe inicializar
            $scope.chatAreaShow = false;
            newMessageFactory.setMessage(contacts, true);
            // Limpiar chats
            currentChatFactory.clear();
            // Cargar los chats (aunque todavía no exista)
            $scope.chatArea = currentChatFactory.chats;
        }
        else{// El mensaje que se va a mandar es para un chat existente, directo a firebase
        
            // Cargar chats
            currentChatFactory.loadChat(data.chatId, $window.document, function(){
                $scope.chatArea = currentChatFactory.chats;
            });

            // Preparar campo de texto para nuevo mensaje
            newMessageFactory.setMessage(data.chatId);
        }
        // Mostrar área de chat
        $scope.chatAreaShow = true;
    });

	// Envía el mensaje, ya sea por firebase si ya existe la conversación o por API si es un nuevo chat
    $scope.sendChatMessage = function (){

        // Enviar el mensaje si se ha escrito algo en el campo de nuevo mensaje y no hay mensaje enviándose en curso
        if ($scope.chatNewMessageContent != '' && !newMessageFactory.isSending) {

            // Preparando objeto de nuevo mensaje
            newMessageFactory.createMessage($scope.chatNewMessageContent, $scope.chatNewMessageBomb);

            // Vaciar el campo de chat y desmarcar bomba
            $scope.chatNewMessageContent = '';
            $scope.chatNewMessageBomb = false;

            newMessageFactory.isSending = true;
            // Enviar el mensaje
            chatService.sendChatMessage(function (chatId, callback){
                // Cargar chats
                currentChatFactory.loadChat(chatId, $window.document, function(){
	                $scope.chatArea = currentChatFactory.chats;
                    callback();
	            });
                // Los nuevos mensajes deben enviarse al chat indicado
                newMessageFactory.setMessage(chatId);
            });
        }
    };

    // Explota una bomba del chat actual
    $scope.explodeBomb = function (message) {
        currentChatFactory.explode(message);
    };

    // Saber si el nombre del chat es número o no
    function isNumber(n){
        n = Number(n);
        return n % 1 === 0;
    }

}]);