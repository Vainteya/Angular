(function () {
  'use strict';

  angular
    .module('studyNotesApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$location', 'AuthService'];
  function LoginController($scope, $location, AuthService) {
    // Already logged in: skip the login page.
    if (AuthService.isAuthenticated()) {
      $location.path('/notes').replace();
      return;
    }

    $scope.credentials = { email: '', password: '' };
    $scope.submitted = false;
    $scope.errorMessage = '';
    $scope.demoUser = AuthService.demoUser;

    $scope.login = function (form) {
      $scope.submitted = true;
      $scope.errorMessage = '';

      // Field-level messages are shown in the template; stop here if invalid.
      if (form.$invalid) {
        return;
      }

      if (AuthService.login($scope.credentials.email, $scope.credentials.password)) {
        $location.path('/notes');
      } else {
        $scope.errorMessage = 'Incorrect email or password.';
        $scope.credentials.password = '';
      }
    };
  }
})();
