const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const TaskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', TaskSchema);

// API Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  await newTask.save();
  res.json(newTask);
});

app.get('/', (req, res) => {
  res.send('Backend API is running successfully! 🚀');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));