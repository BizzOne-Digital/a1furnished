import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI, adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Shield, Lock, Users, Eye, EyeOff } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [addingUser, setAddingUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const loadUsers = async () => {
    if (user?.role !== 'superadmin') return;
    setUsersLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('New passwords do not match'); return; }
    if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) { toast.error('Please fill all fields'); return; }
    setAddingUser(true);
    try {
      await adminAPI.createUser(newUser);
      toast.success('Admin user created!');
      setNewUser({ name: '', email: '', password: '', role: 'admin' });
      setShowAddUser(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this admin user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const tabs = [
    { id: 'password', icon: <Lock size={16} />, label: 'Change Password' },
    ...(user?.role === 'superadmin' ? [{ id: 'users', icon: <Users size={16} />, label: 'Admin Users' }] : []),
    { id: 'about', icon: <Shield size={16} />, label: 'About' }
  ];

  const PwInput = ({ label, field }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={showPw[field] ? 'text' : 'password'} className="form-control"
          value={pwForm[field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']}
          onChange={e => setPwForm(prev => ({ ...prev, [field === 'current' ? 'currentPassword' : field === 'new' ? 'newPassword' : 'confirmPassword']: e.target.value }))}
          placeholder="••••••••" style={{ paddingRight: '42px' }} />
        <button type="button" onClick={() => setShowPw(prev => ({ ...prev, [field]: !prev[field] }))}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
          {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Montserrat', fontSize: '24px', color: 'var(--navy)', marginBottom: '2px' }}>Settings</h1>
        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Manage your account and admin settings</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '12px', boxShadow: 'var(--shadow)', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === tab.id ? 'var(--navy)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--gray)', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div style={{ maxWidth: '480px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '6px', color: 'var(--navy)' }}>Change Password</h3>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '24px' }}>Choose a strong password with at least 8 characters</p>
            <form onSubmit={handlePasswordChange}>
              <PwInput label="Current Password" field="current" />
              <PwInput label="New Password" field="new" />
              <PwInput label="Confirm New Password" field="confirm" />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={pwLoading}>
                <Save size={16} /> {pwLoading ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && user?.role === 'superadmin' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', color: 'var(--navy)' }}>Admin Users</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddUser(!showAddUser)}>
              <Plus size={14} /> Add Admin
            </button>
          </div>

          {showAddUser && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
              <h4 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px' }}>New Admin User</h4>
              <form onSubmit={handleAddUser}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="Admin Name" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="admin@example.com" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Password *</label>
                    <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Role</label>
                    <select className="form-control" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={addingUser}><Plus size={14} /> {addingUser ? 'Creating...' : 'Create User'}</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddUser(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '14px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            {usersLoading ? <div className="loading-screen" style={{ minHeight: '200px' }}><div className="spinner"></div></div> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--navy)' }}>
                    {['Name', 'Email', 'Role', 'Last Login', 'Action'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.85)', fontFamily: 'Montserrat', fontSize: '12px', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '14px' }}>{u.name?.charAt(0)}</div>
                          <div>
                            <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px' }}>{u.name}</div>
                            {u._id === user._id && <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '4px', fontFamily: 'Montserrat', fontWeight: 700 }}>YOU</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--gray-dark)' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: u.role === 'superadmin' ? '#fde8ec' : 'var(--off-white)', color: u.role === 'superadmin' ? 'var(--red)' : 'var(--gray-dark)', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 700, textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--gray)' }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-CA') : 'Never'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {u._id !== user._id && (
                          <button onClick={() => handleDeleteUser(u._id)}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fde8ec', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--red)' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div style={{ maxWidth: '480px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '28px', color: 'var(--navy)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--red)' }}>A1</span> FURNISHED HOMES
              </div>
              <div style={{ color: 'var(--gray)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Portal</div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              {[
                { label: 'Logged in as', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Role', value: user?.role },
                { label: 'Version', value: '1.0.0' },
                { label: 'Built with', value: 'MERN Stack' }
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--gray)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
