const express = require('express');
const app = express();
app.use(express.json());

let todos = [];

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const todo = { id: Date.now(), title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// DELETE a todo by id
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => String(t.id) === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'todo not found' });
  todos.splice(index, 1);
  res.status(204).end();
});

if (require.main === module) {
  app.listen(3000, () => console.log('Todo app running on port 3000'));
}
module.exports = app;