'use strict';

angular.module('slangAdventure.userService', ['slangAdventure.userFactory', 'firebase'])

.service('userService', ['userFactory', '$firebaseObject', '$firebaseArray', '$firebaseAuth',
function(                 userFactory,   $firebaseObject,   $firebaseArray,   $firebaseAuth) {

    this.imOnline = function (){

        // Referencia en firebase del último visto del usuario
        var lastSeenRef = new Firebase("https://slangvoom.firebaseio.com/lastseen/"+userFactory.getNumber());

        // create an instance of the authentication service
        var auth = $firebaseAuth(lastSeenRef);
        // login with Custom Token
        auth.$authWithCustomToken(userFactory.getFirebaseToken()).then(function(authData) {

            // Cargar el objeto de lastSeen
            var lastSeenObject = $firebaseObject(lastSeenRef);

            // Modificar el objeto
            lastSeenObject.lastSeen = Firebase.ServerValue.TIMESTAMP;

            // Guardar el objeto
            lastSeenObject.$save().then(function() {
                // console.log('Todo bien');
            }, function(error) {
                console.log("Error:", error);
            });

        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    };

}]); 