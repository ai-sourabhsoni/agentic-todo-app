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