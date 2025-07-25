import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });
      
      if (response.ok) {
        setNewTask('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setLoading(false);
  };

  const toggleTask = async (id, completed) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🚀 AKS 3-Node Demo App</h1>
        <p>Full-stack app running on Azure Kubernetes Service</p>
        {health && (
          <div className="health">
            <span>Backend Node: {health.node}</span>
            <span className="status">✅ Healthy</span>
          </div>
        )}
      </header>

      <main>
        <form onSubmit={addTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        <div className="tasks">
          {tasks.length === 0 ? (
            <p>No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`task ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTask(task.id, task.completed)}
              >
                <span>{task.title}</span>
                <span className="status">
                  {task.completed ? '✅' : '⏳'}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
