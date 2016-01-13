'use strict';

angular.module('slangApp.chatListCtrl', ['slangAdventure.chatService', 'slangAdventure.chatListFactory'])

.controller('chatListCtrl', ['$rootScope', '$scope', 'chatService', 'chatListFactory',
function(                     $rootScope,   $scope,   chatService,   chatListFactory) {

	// Cada vez que se escuche la llamada de 'reloadChatList' se actualiza la lista de chats
    $scope.$on('reloadChatList', function(event){
		$scope.chatList = chatListFactory.getChatList();
	});

    // Se le pide al chatCtrl que inicie el chat según el número o chatId
	$scope.startChat = function (number, chatId)
	{
		$scope.$emit('pushChangesToAllNodes', {name: 'startChat', data: {number:number, chatId:chatId}});
	};

}]);