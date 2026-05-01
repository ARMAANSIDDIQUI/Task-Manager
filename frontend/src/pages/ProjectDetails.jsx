import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Edit3, Calendar, User as UserIcon } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const projRes = await API.get('/projects');
      const p = projRes.data.data.find(proj => proj._id === id);
      setProject(p);

      const taskRes = await API.get(`/projects/${id}/tasks`);
      setTasks(taskRes.data.data);
    } catch (err) {
      console.error('Failed to fetch project details');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/projects/${id}/tasks/${editingId}`, taskData);
      } else {
        await API.post(`/projects/${id}/tasks`, taskData);
      }
      setShowModal(false);
      setTaskData({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      await API.delete(`/projects/${id}/tasks/${taskId}`);
      fetchData();
    }
  };

  const openEdit = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setEditingId(task._id);
    setShowModal(true);
  };

  if (!project) return <div className="container">Loading project...</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/projects')} className="btn btn-outline" style={{ marginBottom: '1rem', fontSize: '0.75rem' }}>← Back to Projects</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>{project.name}</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{project.description}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ gap: '0.5rem' }}>
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tasks.map((task) => (
          <div key={task._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>
                {task.status}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(task)} style={{ background: 'none', border: 'none', color: '#64748b' }}><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(task._id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{task.description}</p>
            
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={14} />
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <UserIcon size={14} />
                <span>{task.assignedTo?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>{editingId ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Title</label>
                <input type="text" value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Description</label>
                <textarea value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} rows="2" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Status</label>
                  <select value={taskData.status} onChange={(e) => setTaskData({...taskData, status: e.target.value})}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Due Date</label>
                  <input type="date" value={taskData.dueDate} onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
