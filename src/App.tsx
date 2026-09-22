import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import type { Todo } from './api';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim() || !addDesc.trim()) return;
    try {
      const newTodo = await createTodo(addTitle, addDesc);
      setTodos([newTodo, ...todos]);
      setAddTitle('');
      setAddDesc('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const handleEditOpen = (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTodo) return;
    try {
      const updated = await updateTodo(editTodo._id, {
        title: editTitle,
        description: editDesc,
        completed: editTodo.completed,
      });
      setTodos(todos.map((t) => (t._id === editTodo._id ? updated : t)));
      setEditTodo(null);
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo._id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? updated : t)));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <div className="top-bar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button
            type="button"
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >Pending</button>
          <button
            type="button"
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >Completed</button>
        </div>
        <div className="top-right">
          <span className="stats">{todos.filter((t) => t.completed).length}/{todos.length} done</span>
          <button
            type="button"
            className="btn-add-top"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span> Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : filteredTodos.length === 0 ? (
        <div className="empty-state">No tasks found. Add one!</div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <div key={todo._id} className="todo-card" onClick={() => handleEditOpen(todo)}>
              <div className="card-top">
                <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
                  <span className="dot"></span>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
                <div className="card-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={(e) => { e.stopPropagation(); handleEditOpen(todo); }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete"
                    onClick={(e) => handleDelete(e, todo._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="card-body">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="card-text">
                  <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </h3>
                  <p className="todo-desc">{todo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Task Title..."
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="input-group">
                <textarea
                  placeholder="Task Description..."
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Add Task</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTodo && (
        <div className="modal-overlay" onClick={() => setEditTodo(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="modal-close" onClick={() => setEditTodo(null)}>✕</button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Task Title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="input-group">
                <textarea
                  placeholder="Task Description..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
