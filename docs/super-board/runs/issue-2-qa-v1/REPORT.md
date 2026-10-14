$ POST /todos
HTTP/1.1 201 Created
{"id":1791979134047,"title":"QA live","done":false}$ PATCH /todos/1791979134047/done
HTTP/1.1 200 OK
{"id":1791979134047,"title":"QA live","done":true}$ GET /todos
[{"id":1791979134047,"title":"QA live","done":true}]
$ PATCH /todos/nonexistent-id/done
HTTP/1.1 404 Not Found
{"error":"todo not found"}