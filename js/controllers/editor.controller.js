(function () {
  'use strict';

  angular
    .module('studyNotesApp')
    .controller('EditorController', EditorController);

  EditorController.$inject = ['$scope', '$routeParams', '$location', '$window', 'NotesService'];
  function EditorController($scope, $routeParams, $location, $window, NotesService) {
    var noteId = $routeParams.id;

    $scope.isNew = !noteId;
    $scope.notFound = false;
    $scope.submitted = false;
    $scope.note = { title: '', body: '' };

    if (!$scope.isNew) {
      var existing = NotesService.get(noteId);
      if (existing) {
        $scope.note = existing;
      } else {
        $scope.notFound = true;
      }
    }

    $scope.save = function (form) {
      $scope.submitted = true;
      var title = ($scope.note.title || '').trim();

      // "required" alone accepts whitespace, so check the trimmed title too.
      if (form.$invalid || !title) {
        return;
      }

      if ($scope.isNew) {
        NotesService.create(title, $scope.note.body);
      } else if (!NotesService.update(noteId, title, $scope.note.body)) {
        // The note was deleted elsewhere (e.g. another tab) while editing.
        $scope.notFound = true;
        return;
      }
      backToGrid();
    };

    $scope.remove = function () {
      if ($window.confirm('Delete this note? This cannot be undone.')) {
        NotesService.remove(noteId);
        backToGrid();
      }
    };

    // Nothing was written to storage while editing, so leaving discards changes.
    $scope.cancel = backToGrid;

    $scope.titleIsBlank = function () {
      return !($scope.note.title || '').trim();
    };

    function backToGrid() {
      $location.path('/notes');
    }
  }
})();
