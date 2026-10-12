(function () {
  'use strict';

  angular
    .module('studyNotesApp')
    .factory('NotesService', NotesService);

  NotesService.$inject = ['$window'];
  function NotesService($window) {
    var STORAGE_KEY = 'studyNotes.notes';

    return {
      list: list,
      get: get,
      create: create,
      update: update,
      remove: remove
    };

    // Returns all notes, most recently updated first.
    function list() {
      return load().sort(function (a, b) {
        return b.updatedAt - a.updatedAt;
      });
    }

    // Returns a copy of the note, or null if no note has this id.
    // Copies mean the editor can change its form freely; nothing is
    // persisted until save, which is what makes "cancel" discard changes.
    function get(id) {
      var note = findById(load(), id);
      return note ? angular.copy(note) : null;
    }

    function create(title, body) {
      var notes = load();
      var now = Date.now();
      var note = {
        id: generateId(),
        title: title,
        body: body || '',
        createdAt: now,
        updatedAt: now
      };
      notes.push(note);
      save(notes);
      return angular.copy(note);
    }

    // Returns the updated note, or null if the note no longer exists.
    function update(id, title, body) {
      var notes = load();
      var note = findById(notes, id);
      if (!note) {
        return null;
      }
      note.title = title;
      note.body = body || '';
      note.updatedAt = Date.now();
      save(notes);
      return angular.copy(note);
    }

    // Returns true if a note was removed.
    function remove(id) {
      var notes = load();
      var remaining = notes.filter(function (note) {
        return note.id !== id;
      });
      save(remaining);
      return remaining.length !== notes.length;
    }

    function findById(notes, id) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
          return notes[i];
        }
      }
      return null;
    }

    function load() {
      try {
        var notes = JSON.parse($window.localStorage.getItem(STORAGE_KEY));
        return angular.isArray(notes) ? notes : [];
      } catch (e) {
        // Corrupted storage should not break the app; start with no notes.
        return [];
      }
    }

    function save(notes) {
      $window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    // Time-based prefix plus random suffix keeps ids unique without a backend.
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
  }
})();
