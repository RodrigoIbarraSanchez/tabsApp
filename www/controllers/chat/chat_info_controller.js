'use strict';

angular.module('slangApp.chatInfoCtrl', ['slangAdventure.currentChatFactory', 'slangAdventure.contactsService'])

.controller('chatInfoCtrl', ['$scope', 'currentChatFactory', 'contactsService',
function(                     $scope,   currentChatFactory,   contactsService) {

	// No mostrar la información del chat si no hay ningún chat activo
	$scope.chatInfoAreaShow = false;

	// Cuando se necesita recargar la información del chat actual...
	$scope.$on('reloadChatInfo', function(event){
		// Cargar información del chat actual
		var contactInfo = currentChatFactory.getChatInfo();
		$scope.contact = contactInfo;
		// Obtener la última conexión del usuario
		$scope.lastSeen = '';
		contactsService.getLastSeen(contactInfo.number, function (lastSeen){
			$scope.lastSeen = lastSeen;
		});
		// Mostrar la información del chat
		$scope.chatInfoAreaShow = true;
	});

}]);