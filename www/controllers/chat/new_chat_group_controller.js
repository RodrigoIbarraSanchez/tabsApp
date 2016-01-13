'use strict';

angular.module('slangApp.newChatGroupCtrl', ['slangAdventure.contactsFactory'])

.controller('newChatGroupCtrl', ['$scope', '$mdDialog', 'contactsFactory',
function(                         $scope,   $mdDialog,   contactsFactory) {

    // Mostrar contactos en la ventana
    $scope.contacts = contactsFactory.contacts;

    // Colocar todos los contactos como no seleccionados para agregar al grupo
    unSelectContacts();

    // Toggle de contacto para agregar o quitar contacto al grupo
    $scope.toggleContactToGroup = function (contact){
        contact.isSelected = !contact.isSelected;
    };

    // Crear nuevo grupo de chat con los contactos previamente seleccionados
    $scope.createGroup = function (){

        // Lista de contactos con los que se va a iniciar el nuevo grupo
        var newGroupContacts = [];

        // Revisar cuales son los contactos que se quieren agregar al grupo
        for (var i = $scope.contacts.length - 1; i >= 0; i--) {
            if ($scope.contacts[i].isSelected) {
                newGroupContacts.push($scope.contacts[i].number);
            }
        };

        // Des-seleccionar contactos
        unSelectContacts();

        // Cerrar ventana y retornar los datos de los contactos con los que se hará el nuevo chat
        $mdDialog.hide(newGroupContacts);

    };

    // Colocar todos los contactos como no seleccionados para agregar al grupo
    function unSelectContacts(){
        angular.forEach($scope.contacts, function (contact){
            contact.isSelected = false;
        });
    }

    // Controles de la ventana de diálogo para crear nuevo grupo
    $scope.hide = function() {
        $mdDialog.hide(false);
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

}]);