(function () {
  'use strict';

  angular
    .module('studyNotesApp')
    .controller('NotesController', NotesController);

  NotesController.$inject = ['$scope', '$location', 'NotesService', 'AuthService'];
  function NotesController($scope, $location, NotesService, AuthService) {
    var PREVIEW_LENGTH = 120;

    $scope.notes = NotesService.list();
    $scope.user = AuthService.currentUser();

    $scope.preview = function (body) {
      var text = (body || '').trim();
      if (text.length <= PREVIEW_LENGTH) {
        return text;
      }
      return text.slice(0, PREVIEW_LENGTH).trim() + '…';
    };

    $scope.newNote = function () {
      $location.path('/editor');
    };

    $scope.logout = function () {
      AuthService.logout();
      $location.path('/login');
    };
  }
})();
