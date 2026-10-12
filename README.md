# Study Notes Organizer

A minimalist AngularJS (1.8.3) app for jotting down quick notes and code snippets.
Notes are stored in the browser's `localStorage`, so there is no backend.

## Running it

The views are loaded with `templateUrl`, which browsers block when a page is opened
straight from disk (`file://`). Serve the folder with any static server instead:

```bash
# from the project folder, with Python 3
python -m http.server 8000
```

or, with Node.js:

```bash
npx http-server -p 8000
```

Then open <http://localhost:8000> in a browser. An internet connection is needed the
first time, because AngularJS and ngRoute are loaded from the cdnjs CDN.

**Demo login:** `student@example.com` / `notes123`
(authentication is a client-side mock; the credentials are also shown on the login page).

## Project structure

```
index.html                     Loads AngularJS + ngRoute from CDN and the app scripts
css/styles.css                 Single stylesheet
js/app.js                      Module, ngRoute config, auth guard
js/services/auth.service.js    Mock login/logout, session in localStorage
js/services/notes.service.js   CRUD + list for notes, persisted in localStorage
js/controllers/login.controller.js
js/controllers/notes.controller.js
js/controllers/editor.controller.js
views/login.html               Login form with validation
views/notes.html               Grid of note cards (ng-repeat) with empty state (ng-if)
views/editor.html              Create / edit / delete a note
```

## Routes (ngRoute)

| Route          | Page                     | Protected |
| -------------- | ------------------------ | --------- |
| `#!/login`     | Login                    | No        |
| `#!/notes`     | Notes grid               | Yes       |
| `#!/editor`    | Editor, new note         | Yes       |
| `#!/editor/:id`| Editor, existing note    | Yes       |

Protected routes use a `resolve` guard; if the user isn't logged in, the route is
rejected and the app redirects to the login page. Unknown routes go to the notes grid.

## Behaviour notes

- Notes need a non-blank title; leading and trailing spaces are trimmed.
- Cancel discards edits: the editor works on a copy, and nothing is written until Save.
- Opening an ID that doesn't exist shows a "Note not found" message with a link back.
- Logging out clears the session; notes stay in `localStorage` for the next login.
