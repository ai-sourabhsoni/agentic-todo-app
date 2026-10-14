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
