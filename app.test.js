const request = require('supertest');
const app = require('./app');

test('GET /todos returns empty array', async () => {
  const res = await request(app).get('/todos');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

test('POST /todos creates a todo', async () => {
  const res = await request(app).post('/todos').send({ title: 'Buy milk' });
  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe('Buy milk');
});

test('DELETE /todos/:id returns 204 when the id exists', async () => {
  const created = await request(app).post('/todos').send({ title: 'Delete me' });
  const res = await request(app).delete(`/todos/${created.body.id}`);
  expect(res.statusCode).toBe(204);
});

test('DELETE /todos/:id removes the item from GET /todos', async () => {
  const created = await request(app).post('/todos').send({ title: 'Gone soon' });
  await request(app).delete(`/todos/${created.body.id}`);
  const res = await request(app).get('/todos');
  expect(res.body.find((t) => t.id === created.body.id)).toBeUndefined();
});

test('DELETE /todos/nonexistent-id returns 404', async () => {
  const res = await request(app).delete('/todos/nonexistent-id');
  expect(res.statusCode).toBe(404);
});

test('requiring app does not start a listener', () => {
  const http = require('http');
  const listen = jest.spyOn(http.Server.prototype, 'listen');
  jest.isolateModules(() => require('./app'));
  expect(listen).not.toHaveBeenCalled();
  listen.mockRestore();
});

test('DELETE /todos/:id twice returns 404 the second time', async () => {
  const created = await request(app).post('/todos').send({ title: 'Once only' });
  const first = await request(app).delete(`/todos/${created.body.id}`);
  const second = await request(app).delete(`/todos/${created.body.id}`);
  expect(first.statusCode).toBe(204);
  expect(second.statusCode).toBe(404);
});

test('DELETE /todos/:id removes only the matching todo', async () => {
  const keep = await request(app).post('/todos').send({ title: 'Keep' });
  await new Promise((r) => setTimeout(r, 2));
  const drop = await request(app).post('/todos').send({ title: 'Drop' });
  await request(app).delete(`/todos/${drop.body.id}`);
  const res = await request(app).get('/todos');
  expect(res.body.find((t) => t.id === keep.body.id)).toBeDefined();
  expect(res.body.find((t) => t.id === drop.body.id)).toBeUndefined();
});

test('DELETE /todos/nonexistent-id returns a JSON error body', async () => {
  const res = await request(app).delete('/todos/nonexistent-id');
  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'todo not found' });
});

test('PATCH /todos/:id/done returns 200 with done true', async () => {
  const created = await request(app).post('/todos').send({ title: 'Finish me' });
  const res = await request(app).patch(`/todos/${created.body.id}/done`);
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ ...created.body, done: true });
});

test('PATCH /todos/:id/done is reflected in GET /todos', async () => {
  const created = await request(app).post('/todos').send({ title: 'Check list' });
  await request(app).patch(`/todos/${created.body.id}/done`);
  const res = await request(app).get('/todos');
  expect(res.body.find((t) => t.id === created.body.id).done).toBe(true);
});

test('PATCH /todos/nonexistent-id/done returns 404', async () => {
  const res = await request(app).patch('/todos/nonexistent-id/done');
  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'todo not found' });
});
