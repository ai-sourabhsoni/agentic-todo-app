# agentic-todo-app

Minimal Express todo API used to exercise the super-board autonomous pipeline.

| Thing | Value |
|---|---|
| Stack | Node.js (CommonJS), Express 5 |
| Tests | Jest 30 + supertest (`npm test`) |
| Entry | `app.js` — exports the app, listens on port 3000 |
| Routes | `GET /todos` list · `POST /todos` create (`title` required, 400 otherwise) |
| Storage | in-memory array; resets on restart |
| Base branch | `staging` (merges land here; `main` is promoted by a human) |
| Board | https://github.com/users/ai-sourabhsoni/projects/1 |

## Notes for lane agents

- No database, no migrations, no deploy pipeline detected.
- `app.js` calls `app.listen` at import time; tests importing it should close the server or the process may not exit.
- Missing today: update/delete/toggle-done routes, persistence, input validation beyond `title`.
