(function () {
  'use strict';

  angular
    .module('studyNotesApp')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['$window'];
  function AuthService($window) {
    var STORAGE_KEY = 'studyNotes.session';

    // Mock credentials: there is no backend, so one demo account is accepted.
    var DEMO_USER = { email: 'student@example.com', password: 'notes123' };

    return {
      login: login,
      logout: logout,
      isAuthenticated: isAuthenticated,
      currentUser: currentUser,
      demoUser: { email: DEMO_USER.email, password: DEMO_USER.password }
    };

    function login(email, password) {
      var normalizedEmail = (email || '').trim().toLowerCase();
      if (normalizedEmail !== DEMO_USER.email || password !== DEMO_USER.password) {
        return false;
      }
      $window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: normalizedEmail }));
      return true;
    }

    function logout() {
      $window.localStorage.removeItem(STORAGE_KEY);
    }

    function isAuthenticated() {
      return currentUser() !== null;
    }

    function currentUser() {
      try {
        var session = JSON.parse($window.localStorage.getItem(STORAGE_KEY));
        return session && session.email ? session : null;
      } catch (e) {
        // Corrupted value in storage: treat as logged out.
        return null;
      }
    }
  }
})();
