(function () {
  'use strict';

  angular
    .module('studyNotesApp', ['ngRoute'])
    .config(configureRoutes)
    .run(handleRouteErrors);

  // Resolve guard: the route only loads if the user is logged in.
  // A rejection triggers $routeChangeError, handled in the run block below.
  requireAuth.$inject = ['$q', 'AuthService'];
  function requireAuth($q, AuthService) {
    return AuthService.isAuthenticated() ? true : $q.reject('AUTH_REQUIRED');
  }

  configureRoutes.$inject = ['$routeProvider'];
  function configureRoutes($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/notes', {
        templateUrl: 'views/notes.html',
        controller: 'NotesController',
        resolve: { auth: requireAuth }
      })
      // ":id?" is optional: /editor creates a new note, /editor/<id> edits one.
      .when('/editor/:id?', {
        templateUrl: 'views/editor.html',
        controller: 'EditorController',
        resolve: { auth: requireAuth }
      })
      .otherwise({ redirectTo: '/notes' });
  }

  handleRouteErrors.$inject = ['$rootScope', '$location'];
  function handleRouteErrors($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
      if (rejection === 'AUTH_REQUIRED') {
        $location.path('/login').replace();
      }
    });
  }
})();
