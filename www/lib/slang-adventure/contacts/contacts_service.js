'use strict';

angular.module('slangAdventure.contactsService', ['firebase', 'slangAdventure.userFactory', 'slangAdventure.contactsFactory'])

.service('contactsService', ['$http', 'userFactory', 'contactsFactory', '$firebaseObject', '$firebaseArray', '$firebaseAuth',
function(                     $http,   userFactory,   contactsFactory,   $firebaseObject,   $firebaseArray,   $firebaseAuth) {

    // Obtener la última conexión de un usuario
    this.getLastSeen = function (number, callback){

        // Referencia del lastSeeen
        var contactLastSeenRef = new Firebase("https://slangvoom.firebaseio.com/lastseen/"+number);

        // create an instance of the authentication service
        var auth = $firebaseAuth(contactLastSeenRef);
        // login with Custom Token
        auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {
            
            // Obtener el LastSeen
            var lastSeen = $firebaseObject(contactLastSeenRef);

            // Retornar el lastSeen
            callback(lastSeen);

        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });

    };

    // Servicio para añadir un nuevo contacto
    this.newContact = function (number, name, lastname, callback){
        // Preparando payload
        var data = {
            number: number,
            name: name,
            lastname: lastname
        };
        // Ejecutando API
        $http.put('https://slangbackend.herokuapp.com/api/users/'+userFactory.getNumber()+'/contacts?access_token='+userFactory.getAccessToken(), data).then(
            function(response){
                // Ejecutar el callback
                callback(response.data);
            },
            function(e){
                alert('Algo salió mal u.u');
            }
        );
    };

    // Obtener lista de contactos
    this.getContacts = function (callback){
        // Ejecutando API
        $http.get('https://slangbackend.herokuapp.com/api/users/'+userFactory.getNumber()+'/contacts?access_token='+userFactory.getAccessToken()).then(
            function(response){
                // Añadir contactos al factory
                contactsFactory.contacts = response.data;
                callback();
            },
            function(e){
                alert('Algo salió mal u.u');
            }
        );
    };

}]);