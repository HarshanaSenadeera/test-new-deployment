import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://testtodo-zcofm7tu.b4a.run';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch all tasks on load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false, liked: false }),
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Property (Complete or Like)
  const toggleProperty = async (id, field, currentValue) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Task
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editText }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <header className="app-header">
          <h1>✨ Task Master</h1>
          <p>Organize and track your daily tasks effortlessly</p>
        </header>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? <span className="spinner-sm"></span> : '➕ Add Task'}
          </button>
        </form>

        {/* Task Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">🎉 No tasks found! Add one above.</div>
        ) : (
          <div className="table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Task Title</th>
                  <th>Like</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className={task.completed ? 'completed-row' : ''}>
                    {/* Status Checkbox */}
                    <td>
                      <button
                        className={`status-btn ${task.completed ? 'done' : 'pending'}`}
                        onClick={() => toggleProperty(task._id, 'completed', task.completed)}
                      >
                        {task.completed ? '✓ Done' : 'Pending'}
                      </button>
                    </td>

                    {/* Task Title / Edit Input */}
                    <td className="task-title-cell">
                      {editingId === task._id ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(task._id)}
                        />
                      ) : (
                        <span className={task.completed ? 'completed-text' : ''}>
                          {task.title}
                        </span>
                      )}
                    </td>

                    {/* Like Button */}
                    <td>
                      <button
                        className={`like-btn ${task.liked ? 'liked' : ''}`}
                        onClick={() => toggleProperty(task._id, 'liked', task.liked)}
                      >
                        {task.liked ? '❤️' : '🤍'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      {editingId === task._id ? (
                        <button className="save-btn" onClick={() => saveEdit(task._id)}>
                          💾
                        </button>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingId(task._id);
                            setEditText(task.title);
                          }}
                        >
                          ✏️
                        </button>
                      )}
                      <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
