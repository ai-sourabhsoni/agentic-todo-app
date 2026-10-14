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

app.listen(3000, () => console.log('Todo app running on port 3000'));
module.exports = app;