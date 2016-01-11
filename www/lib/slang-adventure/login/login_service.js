'use strict';

angular.module('slangAdventure.loginService', ['ui.router', 'ngStorage', 'slangAdventure.userFactory'])

.service('loginService', ['$http', '$state', '$localStorage', 'userFactory',
function(                  $http,   $state,   $localStorage,   userFactory) {

    // Registrar un usuario o cambiarle la contraseña
    this.register = function(number, success){
        // Preparando payload
        var data = {number: number};
        // Ejecutando API
        $http.put('https://slangbackend.herokuapp.com/api/users', data).then(
            function(response){
                // Guardar número en el userFactory
                userFactory.setNumber(number);
                // Ejecutar el callback
                success(response);
            },
            function(e){
                alert('Algo salió mal u.u');
            }
        );
    };

    // Iniciar la sesión de un usuario
    this.login = function(code, success){
        // Preparando payload
        var data = {
            user: userFactory.getNumber(),
            password: code,
            environment: 'prod'
        };
        // Ejecutando API
        $http.post('https://slangbackend.herokuapp.com/oauth2/token', data).then(
            function(response){
                // Guardar información en el userFactory
                userFactory.saveLoginInfo(response.data);
                // Guardar token en localStorage
                $localStorage.access_token = response.data.access_token;
                // Ejecutar el callback
                success(response.data.name);
            },
            function(e){
                alert('Código incorrecto');
            }
        );
    };

    // Actualizar información del usuario
    this.updateInfo = function(name, lastname, status, success){
        // Preparando payload
        var data = {
            name: name,
            lastname: lastname,
            status: status
        };
        // Ejecutando API
        $http.patch('https://slangbackend.herokuapp.com/api/users/'+userFactory.getNumber()+'?access_token='+userFactory.getAccessToken(), data).then(
            function(response){
                // Guardar información en el userFactory
                userFactory.setName(name);
                userFactory.setLastname(lastname);
                userFactory.setStatus(status);
                // Ejecutar el callback
                success();
            },
            function(e){
                alert('Algo salió mal u.u');
            }
        );
    };

    // Checa si el usuario ya había iniciado sesión y el token sigue siendo válido
    this.autoLogin = function (callback){
    	if ($localStorage.access_token == null) {
	        callback(true); // No estaba loggeado
    	}
    	else{
    		// Ejecutando API
	        $http.get('https://slangbackend.herokuapp.com/oauth2/user?access_token='+$localStorage.access_token).then(
	            function(response){
	                // Guardar información en el userFactory
	                response.data.access_token = $localStorage.access_token;
	                userFactory.saveLoginInfo(response.data);
	                // Guardar token en localStorage
	                $localStorage.access_token = response.data.access_token;
	                // Ejecutar el callback
	                callback(false); // Ya estaba loggeado y funciona el token
	            },
	            function(e){
	            	$localStorage.$reset();
	            	callback(true); // No sirve el token viejo
	            }
	        );
    	}
    };

    // Cerrar sesión
    this.logout = function (){
        userFactory.reset();
        $localStorage.$reset();
        $state.go('login');
    };

}]);