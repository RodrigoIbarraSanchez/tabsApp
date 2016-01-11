angular.module('starter.controllers', ['slangAdventure.loginService', 'slangAdventure.userFactory'])

.controller('loginCtrl', ['$scope', '$rootScope', '$state', 'loginService',
  function ($scope, $rootScope, $state, loginService) {

                //Para registrar a un usuario:
                // Registrar o cambiar contraseña si ya estaba registrado
                $scope.register = function () {
                  var number = $scope.countryCode + $scope.number;
                  loginService.register(number, function (response) {
                    alert(response.data);
                    $rootScope.formRegister = false;
                    $rootScope.formLogin = true;
                  });
                };

                // Registrar o cambiar contraseña si ya estaba registrado
                $scope.register = function () {
                  var number = $scope.countryCode + $scope.number;
                  loginService.register(number, function (response) {
                    alert(response.data);
                  });
                };

                $scope.login = function () {
                  loginService.login($scope.verificationCode, function (name) {
                    if (userFactory.getName() == null || userFactory.getName() == "") {
                                        // Mandar al formulario de Nombre, Apellidos y Estado
                                      } else {
                                        // $state.go('main');
                                      }
                                    });
                };

              }])

.controller('smsCodeCtrl', ['$scope', '$state', '$rootScope', 'userFactory', 'loginService', function ($scope, $state, $rootScope, userFactory, loginService) {
        $scope.login = function () {
                loginService.login($scope.verificationCode, function (name) {
                        $rootScope.formLogin = false;
                        if (userFactory.getName() == null || userFactory.getName() == "") {
                                $rootScope.formInfo = true;
                        } else {
                                $state.go('tab.chats');
                        }
                });
        };
}])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

$scope.chats = Chats.all();
$scope.remove = function(chat) {
  Chats.remove(chat);
};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
