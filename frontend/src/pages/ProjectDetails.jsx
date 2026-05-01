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
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [taskData, setTaskData] = useState({ 
    title: '', 
    description: '', 
    status: 'Todo', 
    priority: 'Medium', 
    dueDate: '',
    assignedTo: [] 
  });
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'due'
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
      setTaskData({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '', assignedTo: [] });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/projects/${id}`, { 
        members: [...project.members.map(m => m._id), newMemberEmail] 
      });
      setNewMemberEmail('');
      setShowMemberModal(false);
      fetchData();
    } catch (err) {
      alert('Could not add member. Make sure the email is valid.');
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
      assignedTo: task.assignedTo?.map(a => a._id) || [],
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setEditingId(task._id);
    setShowModal(true);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'due') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!project) return <div className="container">Loading project...</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/projects')} className="btn btn-outline" style={{ marginBottom: '1rem', fontSize: '0.75rem' }}>← Back to Projects</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1>{project.name}</h1>
                <span className="badge badge-done" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                    {project.members.length + 1} Team Members
                </span>
            </div>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{project.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Sort by:</span>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: 'auto', fontSize: '0.875rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
                >
                    <option value="newest">Newest</option>
                    <option value="due">Due Date</option>
                </select>
            </div>
            {user?.role === 'Admin' && (
                <>
                    <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>Manage Team</button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ gap: '0.5rem' }}>
                        <Plus size={18} /> Add Task
                    </button>
                </>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b' }}>Task Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b' }}>Priority</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b' }}>Assigned To</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b' }}>Due Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#64748b', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
                <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        No tasks found. Click "Add Task" to get started!
                    </td>
                </tr>
            ) : (
                sortedTasks.map((task) => (
                    <tr key={task._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{task.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{task.description?.substring(0, 40)}{task.description?.length > 40 ? '...' : ''}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                            <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                                {task.priority}
                            </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                            {(user?.role === 'Admin' || task.assignedTo.some(a => String(a._id || a) === String(user?.id))) ? (
                                <select 
                                    value={task.status} 
                                    onChange={async (e) => {
                                        try {
                                            await API.put(`/projects/${id}/tasks/${task._id}`, { status: e.target.value });
                                            fetchData();
                                        } catch (err) {
                                            alert('Failed to update status');
                                        }
                                    }}
                                    className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}
                                    style={{ border: 'none', cursor: 'pointer', appearance: 'none', width: 'auto', paddingRight: '1.5rem', backgroundPosition: 'right 0.5rem center', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat' }}
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            ) : (
                                <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>
                                    {task.status}
                                </span>
                            )}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <UserIcon size={14} color="#64748b" />
                                <span>
                                    {task.assignedTo?.length > 0 
                                        ? task.assignedTo.map((a, idx) => {
                                            const isMe = String(a._id || a) === String(user?.id);
                                            return (
                                                <span key={a._id || a} style={{ fontWeight: isMe ? '600' : 'normal' }}>
                                                    {a.name}{isMe ? ' (you)' : ''}
                                                    {idx < task.assignedTo.length - 1 ? ', ' : ''}
                                                </span>
                                            );
                                          })
                                        : 'Unassigned'}
                                </span>
                            </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span>{task.dueDate ? (() => {
                                    const d = new Date(task.dueDate);
                                    const day = String(d.getDate()).padStart(2, '0');
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const year = d.getFullYear();
                                    return `${day}/${month}/${year}`;
                                })() : '—'}</span>
                                {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                                    <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Overdue</span>
                                )}
                            </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                {user?.role === 'Admin' && (
                                    <>
                                        <button onClick={() => openEdit(task)} className="btn-icon" title="Edit Task"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(task._id)} className="btn-icon" title="Delete Task" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>{editingId ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Title</label>
                <input 
                    type="text" 
                    value={taskData.title} 
                    onChange={(e) => setTaskData({...taskData, title: e.target.value})} 
                    disabled={user?.role === 'Member'}
                    required 
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Description</label>
                <textarea 
                    value={taskData.description} 
                    onChange={(e) => setTaskData({...taskData, description: e.target.value})} 
                    disabled={user?.role === 'Member'}
                    rows="2" 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Assign To {user?.role === 'Member' && '(Read-only)'}</label>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.375rem', padding: '0.75rem', maxHeight: '150px', overflowY: 'auto', background: user?.role === 'Member' ? '#f8fafc' : 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input 
                            type="checkbox" 
                            style={{ width: 'auto' }}
                            checked={taskData.assignedTo.includes(project.admin?._id)}
                            disabled={user?.role === 'Member'}
                            onChange={(e) => {
                                const id = project.admin?._id;
                                const newAssigned = e.target.checked 
                                    ? [...taskData.assignedTo, id] 
                                    : taskData.assignedTo.filter(a => a !== id);
                                setTaskData({...taskData, assignedTo: newAssigned});
                            }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{project.admin?.name} (Admin)</span>
                    </div>
                    {project.members.map(member => (
                        <div key={member._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input 
                                type="checkbox" 
                                style={{ width: 'auto' }}
                                checked={taskData.assignedTo.includes(member._id)}
                                disabled={user?.role === 'Member'}
                                onChange={(e) => {
                                    const id = member._id;
                                    const newAssigned = e.target.checked 
                                        ? [...taskData.assignedTo, id] 
                                        : taskData.assignedTo.filter(a => a !== id);
                                    setTaskData({...taskData, assignedTo: newAssigned});
                                }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>{member.name}</span>
                        </div>
                    ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Status</label>
                  <select value={taskData.status} onChange={(e) => setTaskData({...taskData, status: e.target.value})}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Priority</label>
                  <select value={taskData.priority} onChange={(e) => setTaskData({...taskData, priority: e.target.value})} disabled={user?.role === 'Member'}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Due Date</label>
                <input type="date" value={taskData.dueDate} onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} disabled={user?.role === 'Member'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2>Manage Team</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.5rem 0 1.5rem' }}>Search for users by email to add them to the team.</p>
            
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Search User Email</label>
                <input 
                    type="text" 
                    value={newMemberEmail} 
                    onChange={async (e) => {
                        const val = e.target.value;
                        setNewMemberEmail(val);
                        if (val.length > 2) {
                            const res = await API.get(`/auth/search?email=${val}`);
                            setSearchResults(res.data.data);
                        } else {
                            setSearchResults([]);
                        }
                    }} 
                    placeholder="Type email to search..." 
                    required 
                />
                
                {searchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', zIndex: 110, marginTop: '0.25rem' }}>
                        {searchResults.map(u => (
                            <div 
                                key={u._id} 
                                onClick={async () => {
                                    try {
                                        await API.put(`/projects/${id}`, { 
                                            members: [...project.members.map(m => m._id), u._id] 
                                        });
                                        setNewMemberEmail('');
                                        setSearchResults([]);
                                        fetchData();
                                    } catch (err) {
                                        alert('Could not add member.');
                                    }
                                }}
                                style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}
                                onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{u.email}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowMemberModal(false); setSearchResults([]); setNewMemberEmail(''); }}>Close</button>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '0.75rem' }}>Current Team</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem' }}>
                        <strong>{project.admin?.name}</strong> (Admin)
                    </div>
                    {project.members.map(m => (
                        <div key={m._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{m.name}</span>
                            <span style={{ color: '#94a3b8' }}>Member</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
