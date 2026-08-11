import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f8fafc; }

  .dash-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 260px; background: #0f172a; flex-shrink: 0;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh;
    z-index: 100; overflow-y: auto;
  }
  .sb-logo {
    display: flex; align-items: center; gap: 12px;
    padding: 1.8rem 1.5rem; border-bottom: 1px solid #1e293b;
    text-decoration: none;
  }
  .sb-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    border-radius: 11px; display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(22,163,74,0.4);
  }
  .sb-logo-text { font-size: 1.15rem; font-weight: 800; color: #fff; }
  .sb-logo-text span { color: #4ade80; }

  .sb-user {
    padding: 1.2rem 1.5rem; border-bottom: 1px solid #1e293b;
    display: flex; align-items: center; gap: 12px;
  }
  .sb-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #15803d);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff; flex-shrink: 0;
    border: 2px solid #166534;
  }
  .sb-uname { font-size: 0.88rem; font-weight: 600; color: #fff; }
  .sb-urole {
    font-size: 0.72rem; color: #4ade80; font-weight: 500;
    background: rgba(74,222,128,0.12); padding: 2px 8px;
    border-radius: 10px; display: inline-block; margin-top: 3px;
  }

  .sb-nav { padding: 1rem 0; flex: 1; }
  .sb-section {
    font-size: 0.68rem; font-weight: 700; color: #475569;
    text-transform: uppercase; letter-spacing: 1.5px;
    padding: 0.5rem 1.5rem; margin-top: 0.5rem;
  }
  .sb-item {
    display: flex; align-items: center; gap: 12px;
    padding: 0.75rem 1.5rem; color: #94a3b8;
    font-size: 0.88rem; font-weight: 500; cursor: pointer;
    transition: all 0.2s; text-decoration: none;
    border-left: 3px solid transparent;
  }
  .sb-item:hover { background: #1e293b; color: #fff; }
  .sb-item.active {
    background: rgba(22,163,74,0.15); color: #4ade80;
    font-weight: 600; border-left-color: #16a34a;
  }
  .sb-icon { font-size: 1.1rem; width: 22px; text-align: center; flex-shrink: 0; }
  .sb-badge {
    margin-left: auto; background: #16a34a; color: #fff;
    font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 10px;
  }

  .sb-bottom { padding: 1rem 1.5rem; border-top: 1px solid #1e293b; }
  .logout-btn {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 0.75rem 1rem; background: rgba(239,68,68,0.1);
    color: #f87171; border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .logout-btn:hover { background: rgba(239,68,68,0.2); color: #ef4444; }

  /* ── MAIN ── */
  .main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }

  .topbar {
    background: #fff; padding: 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
  }
  .tb-title { font-size: 1.3rem; font-weight: 700; color: #111827; }
  .tb-date  { font-size: 0.82rem; color: #6b7280; margin-top: 2px; }
  .tb-right { display: flex; align-items: center; gap: 10px; }
  .tb-btn {
    width: 38px; height: 38px; border-radius: 10px;
    background: #f9fafb; border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer; transition: all 0.2s;
  }
  .tb-btn:hover { background: #f0fdf4; border-color: #16a34a; }
  .tb-user {
    display: flex; align-items: center; gap: 8px;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 10px; padding: 6px 12px; cursor: pointer;
  }
  .tb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #15803d);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .tb-name { font-size: 0.82rem; font-weight: 600; color: #374151; }

  .page { padding: 2rem; flex: 1; }

  /* ── LOADING ── */
  .loading {
    display: flex; align-items: center; justify-content: center;
    padding: 4rem; flex-direction: column; gap: 1rem;
  }
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid #e5e7eb; border-top-color: #16a34a;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── ALERTS ── */
  .alert-err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.9rem 1.2rem; border-radius: 12px; font-size: 0.88rem; margin-bottom: 1.5rem; }
  .alert-ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a;  padding: 0.9rem 1.2rem; border-radius: 12px; font-size: 0.88rem; margin-bottom: 1.5rem; }

  /* ── WELCOME ── */
  .welcome {
    background: linear-gradient(135deg, #14532d, #166534, #15803d);
    border-radius: 20px; padding: 2rem 2.5rem;
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 2rem; position: relative; overflow: hidden;
  }
  .welcome::before { content: ''; position: absolute; top: -60px; right: -60px; width: 250px; height: 250px; background: rgba(255,255,255,0.05); border-radius: 50%; }
  .welcome-h { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.4rem; }
  .welcome-p { font-size: 0.9rem; color: #bbf7d0; line-height: 1.6; max-width: 420px; }
  .welcome-cta {
    background: #fff; color: #14532d; padding: 0.75rem 1.8rem;
    border-radius: 10px; font-size: 0.92rem; font-weight: 700;
    border: none; cursor: pointer; font-family: inherit;
    transition: all 0.2s; flex-shrink: 0; z-index: 1;
  }
  .welcome-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }

  /* ── STATS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.2rem; margin-bottom: 2rem; }
  .stat-card {
    background: #fff; border-radius: 16px; padding: 1.5rem;
    border: 1px solid #e5e7eb; transition: all 0.3s; position: relative; overflow: hidden;
  }
  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
  .stat-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .sc-g::after { background: linear-gradient(90deg,#16a34a,#4ade80); }
  .sc-b::after { background: linear-gradient(90deg,#2563eb,#60a5fa); }
  .sc-a::after { background: linear-gradient(90deg,#d97706,#fbbf24); }
  .sc-p::after { background: linear-gradient(90deg,#7c3aed,#a78bfa); }
  .stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1rem; }
  .si-g{background:#dcfce7} .si-b{background:#dbeafe} .si-a{background:#fef3c7} .si-p{background:#ede9fe}
  .stat-val { font-size: 2rem; font-weight: 900; color: #111827; display: block; }
  .stat-lbl { font-size: 0.82rem; color: #6b7280; font-weight: 500; }
  .stat-sub { font-size: 0.75rem; font-weight: 600; color: #16a34a; margin-top: 6px; }

  /* ── GRID ── */
  .g2   { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
  .g2eq { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
  .vcol { display: flex; flex-direction: column; gap: 1.5rem; }

  /* ── CARD ── */
  .card { background: #fff; border-radius: 20px; border: 1px solid #e5e7eb; overflow: hidden; }
  .card-h { padding: 1.2rem 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .card-t { font-size: 1rem; font-weight: 700; color: #111827; }
  .card-a { font-size: 0.8rem; color: #16a34a; font-weight: 600; cursor: pointer; background: none; border: none; font-family: inherit; }
  .card-b { padding: 1.5rem; }

  /* ── DIAGNOSIS ROW ── */
  .d-row { display: flex; align-items: center; gap: 14px; padding: 0.9rem 0; border-bottom: 1px solid #f3f4f6; }
  .d-row:last-child { border-bottom: none; }
  .d-icon { width: 44px; height: 44px; border-radius: 12px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
  .d-info { flex: 1; min-width: 0; }
  .d-plant   { font-size: 0.9rem; font-weight: 600; color: #111827; }
  .d-disease { font-size: 0.8rem; color: #6b7280; margin-top: 1px; }
  .d-date    { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
  .d-badge   { font-size: 0.74rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; white-space: nowrap; flex-shrink: 0; }
  .db-treated  { background: #dcfce7; color: #15803d; }
  .db-pending  { background: #fef3c7; color: #92400e; }
  .db-critical { background: #fef2f2; color: #dc2626; }

  /* ── QUICK ACTIONS ── */
  .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .qa-item { display: flex; align-items: center; gap: 10px; padding: 1rem; border-radius: 14px; border: 1.5px solid #e5e7eb; cursor: pointer; transition: all 0.2s; background: #fff; }
  .qa-item:hover { border-color: #16a34a; background: #f0fdf4; transform: translateY(-2px); }
  .qa-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .qa-t { font-size: 0.85rem; font-weight: 600; color: #111827; }
  .qa-d { font-size: 0.75rem; color: #9ca3af; }

  /* ── TIP ── */
  .tip-row { display: flex; align-items: flex-start; gap: 12px; padding: 0.9rem 0; border-bottom: 1px solid #f3f4f6; }
  .tip-row:last-child { border-bottom: none; }
  .tip-icon { width: 36px; height: 36px; border-radius: 10px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .tip-t { font-size: 0.88rem; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .tip-d { font-size: 0.8rem; color: #6b7280; line-height: 1.5; }

  /* ── UPLOAD ── */
  .upload-area { border: 2px dashed #d1d5db; border-radius: 16px; padding: 2.5rem; text-align: center; cursor: pointer; transition: all 0.3s; background: #fafafa; }
  .upload-area:hover { border-color: #16a34a; background: #f0fdf4; }
  .up-icon  { font-size: 3rem; display: block; margin-bottom: 1rem; }
  .up-title { font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 0.4rem; }
  .up-desc  { font-size: 0.85rem; color: #6b7280; line-height: 1.6; margin-bottom: 1.2rem; }

  .green-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; padding: 0.75rem 1.8rem; border-radius: 10px;
    font-size: 0.9rem; font-weight: 600; cursor: pointer;
    border: none; font-family: inherit; transition: all 0.2s; justify-content: center;
  }
  .green-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(22,163,74,0.35); }
  .green-btn:disabled { background: #86efac; cursor: not-allowed; }

  /* ── FORM ── */
  .form-group { margin-bottom: 1.1rem; }
  .form-label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
  .form-input {
    width: 100%; padding: 0.68rem 0.9rem; border: 1.5px solid #e5e7eb;
    border-radius: 10px; font-size: 0.92rem; outline: none; color: #111827;
    background: #f9fafb; font-family: inherit; transition: all 0.2s;
  }
  .form-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
  .form-select {
    width: 100%; padding: 0.68rem 0.9rem; border: 1.5px solid #e5e7eb;
    border-radius: 10px; font-size: 0.92rem; outline: none; color: #111827;
    background: #f9fafb; font-family: inherit; cursor: pointer;
  }
  .form-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
  .form-textarea {
    width: 100%; padding: 0.68rem 0.9rem; border: 1.5px solid #e5e7eb;
    border-radius: 10px; font-size: 0.92rem; outline: none; color: #111827;
    background: #f9fafb; font-family: inherit; transition: all 0.2s; resize: vertical; min-height: 110px;
  }
  .form-textarea:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

  /* ── AI PENDING ── */
  .ai-pending {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1.5px solid #fbbf24; border-radius: 16px;
    padding: 1.5rem; margin-top: 1rem; text-align: center;
  }
  .ai-pending-icon  { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
  .ai-pending-title { font-size: 1rem; font-weight: 700; color: #92400e; margin-bottom: 0.4rem; }
  .ai-pending-desc  { font-size: 0.85rem; color: #b45309; line-height: 1.6; }

  /* ── PROFILE ── */
  .prof-center { text-align: center; padding: 1rem 0; }
  .prof-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #15803d);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 700; color: #fff;
    margin: 0 auto 1rem; border: 3px solid #dcfce7;
    box-shadow: 0 4px 16px rgba(22,163,74,0.3);
  }
  .prof-name  { font-size: 1.1rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .prof-email { font-size: 0.82rem; color: #6b7280; margin-bottom: 8px; }
  .prof-role  { display: inline-block; background: #dcfce7; color: #15803d; font-size: 0.78rem; font-weight: 600; padding: 4px 14px; border-radius: 20px; margin-bottom: 1.5rem; }
  .prof-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem; }
  .ps-box { background: #f9fafb; border-radius: 12px; padding: 12px; border: 1px solid #e5e7eb; text-align: center; }
  .ps-v { font-size: 1.4rem; font-weight: 800; color: #14532d; display: block; }
  .ps-l { font-size: 0.75rem; color: #6b7280; }

  /* ── STAR RATING ── */
  .star-row { display: flex; gap: 8px; margin-bottom: 1rem; }
  .star-btn {
    font-size: 1.8rem; cursor: pointer; background: none; border: none;
    transition: transform 0.2s ease; line-height: 1;
    filter: grayscale(1); opacity: 0.4;
  }
  .star-btn:hover { transform: scale(1.2); }
  .star-btn.active { filter: grayscale(0); opacity: 1; }

  /* ── FEEDBACK LIST ── */
  .fb-item {
    background: #f9fafb; border-radius: 16px; padding: 1.2rem 1.4rem;
    border: 1px solid #e5e7eb; margin-bottom: 1rem; transition: all 0.2s;
  }
  .fb-item:hover { border-color: #bbf7d0; background: #f0fdf4; }
  .fb-item:last-child { margin-bottom: 0; }
  .fb-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
  .fb-user   { display: flex; align-items: center; gap: 10px; }
  .fb-ava    { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #16a34a, #15803d); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .fb-uname  { font-size: 0.88rem; font-weight: 600; color: #111827; }
  .fb-role   { font-size: 0.72rem; color: #6b7280; }
  .fb-stars  { color: #f59e0b; font-size: 0.9rem; letter-spacing: 2px; }
  .fb-date   { font-size: 0.72rem; color: #9ca3af; }
  .fb-cat    { display: inline-block; font-size: 0.72rem; font-weight: 600; padding: 2px 9px; border-radius: 999px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; margin-bottom: 8px; }
  .fb-text   { font-size: 0.88rem; color: #374151; line-height: 1.7; }

  /* ── TOGGLE ── */
  .toggle { width: 44px; height: 24px; background: #16a34a; border-radius: 12px; position: relative; cursor: pointer; flex-shrink: 0; }
  .toggle-dot { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; right: 3px; top: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

  /* ── EMPTY ── */
  .empty { text-align: center; padding: 3rem; }
  .empty-icon  { font-size: 3rem; display: block; margin-bottom: 1rem; }
  .empty-title { font-size: 1rem; font-weight: 600; color: #111827; margin-bottom: 4px; }
  .empty-desc  { font-size: 0.85rem; color: #6b7280; }

  /* ── SUCCESS SUBMITTED ── */
  .submitted-box { text-align: center; padding: 2.5rem; }
  .submitted-icon  { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
  .submitted-title { font-size: 1.15rem; font-weight: 700; color: #111827; margin-bottom: 6px; }
  .submitted-desc  { font-size: 0.88rem; color: #6b7280; margin-bottom: 1.5rem; }

  @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2,1fr); } .g2 { grid-template-columns: 1fr; } }
  @media (max-width: 768px)  { .sidebar { transform: translateX(-100%); } .main { margin-left: 0; } .stats-grid { grid-template-columns: repeat(2,1fr); } .g2eq { grid-template-columns: 1fr; } .page { padding: 1rem; } .welcome { flex-direction: column; gap: 1.5rem; text-align: center; } }
`;

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function getPlantIcon(name) {
  if (!name) return '🌿';
  const n = name.toLowerCase();
  if (n.includes('tomato'))     return '🍅';
  if (n.includes('potato'))     return '🥔';
  if (n.includes('corn'))       return '🌽';
  if (n.includes('pepper'))     return '🌶️';
  if (n.includes('apple'))      return '🍎';
  if (n.includes('grape'))      return '🍇';
  if (n.includes('rice'))       return '🌾';
  if (n.includes('strawberry')) return '🍓';
  return '🌿';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const token     = localStorage.getItem('token');
  const [user,       setUser]       = useState(null);
  const [menu,       setMenu]       = useState('dashboard');
  const [stats,      setStats]      = useState(null);
  const [diagnoses,  setDiagnoses]  = useState([]);
  const [profile,    setProfile]    = useState(null);
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [time,       setTime]       = useState(new Date());

  // Diagnosis form
  const [plantName,  setPlantName]  = useState('');
  const [notes,      setNotes]      = useState('');
  const [image,      setImage]      = useState(null);
  const [dragOver,   setDragOver]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [diagMsg,    setDiagMsg]    = useState('');
  const [diagErr,    setDiagErr]    = useState('');
  const [diagDone,   setDiagDone]   = useState(false);

  // Profile edit
  const [editMode,   setEditMode]   = useState(false);
  const [editForm,   setEditForm]   = useState({});
  const [profMsg,    setProfMsg]    = useState('');
  const [profErr,    setProfErr]    = useState('');
  const [saving,     setSaving]     = useState(false);

  // Feedback form
  const [fbRating,   setFbRating]   = useState(0);
  const [fbHover,    setFbHover]    = useState(0);
  const [fbCategory, setFbCategory] = useState('General');
  const [fbMessage,  setFbMessage]  = useState('');
  const [fbTitle,    setFbTitle]    = useState('');
  const [fbSubmitting,setFbSubmit]  = useState(false);
  const [fbDone,     setFbDone]     = useState(false);
  const [fbErr,      setFbErr]      = useState('');

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const roleLabel = (profile?.role || user?.role) === 'farmer'   ? '🌾 Farmer'
                  : (profile?.role || user?.role) === 'gardener' ? '🌱 Home Gardener'
                  : '🔬 Researcher';

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user ? `${user.firstName} ${user.lastName}` : '';

  const initials = profile
    ? `${profile.firstName?.[0]}${profile.lastName?.[0]}`
    : user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : '?';

  // ── Fetch all ──────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true); setError('');
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [sRes, dRes, pRes, fbRes] = await Promise.all([
        fetch(`${BACKEND}/api/diagnoses/stats`, { headers: h }),
        fetch(`${BACKEND}/api/diagnoses`,        { headers: h }),
        fetch(`${BACKEND}/api/profile`,          { headers: h }),
        fetch(`${BACKEND}/api/feedback/my`,      { headers: h }),
      ]);
      if (sRes.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); return; }
      setStats(await sRes.json());
      const dData = await dRes.json(); setDiagnoses(Array.isArray(dData) ? dData : []);
      const pData = await pRes.json(); setProfile(pData);
      setEditForm({ firstName: pData.firstName, lastName: pData.lastName, email: pData.email });
      const fbData = await fbRes.json(); setFeedbacks(Array.isArray(fbData) ? fbData : []);
    } catch {
      setError('Cannot connect to backend. Make sure node server.js is running!');
    } finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchAll();
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, [fetchAll]);

  function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }

  // ── Submit diagnosis ───────────────────────────
  async function submitDiagnosis() {
    setDiagErr(''); setDiagMsg('');
    if (!plantName.trim()) { setDiagErr('Please enter the plant name.'); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`${BACKEND}/api/diagnoses`, {
        method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ plantName: plantName.trim(), notes: notes.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setDiagErr(data.message || 'Failed.'); return; }
      setDiagMsg('Diagnosis submitted and saved to MySQL!');
      setDiagDone(true); setPlantName(''); setNotes(''); setImage(null);
      fetchAll();
    } catch { setDiagErr('Cannot connect to backend.'); }
    finally { setSubmitting(false); }
  }

  // ── Delete diagnosis ───────────────────────────
  async function deleteDiag(id) {
    if (!window.confirm('Delete this diagnosis?')) return;
    try {
      await fetch(`${BACKEND}/api/diagnoses/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
      fetchAll();
    } catch { alert('Could not delete.'); }
  }

  // ── Save profile ───────────────────────────────
  async function saveProfile() {
    setProfErr(''); setProfMsg('');
    if (!editForm.firstName || !editForm.lastName || !editForm.email) { setProfErr('All fields required.'); return; }
    setSaving(true);
    try {
      const res  = await fetch(`${BACKEND}/api/profile/update`, {
        method: 'PUT', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { setProfErr(data.message || 'Update failed.'); return; }
      setProfMsg('Profile updated!');
      const updated = { ...user, ...editForm };
      setUser(updated); localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false); fetchAll();
    } catch { setProfErr('Cannot connect to backend.'); }
    finally { setSaving(false); }
  }

  // ── Submit feedback ────────────────────────────
  async function submitFeedback() {
    setFbErr('');
    if (!fbRating)           { setFbErr('Please select a star rating.');  return; }
    if (!fbTitle.trim())     { setFbErr('Please enter a feedback title.'); return; }
    if (!fbMessage.trim())   { setFbErr('Please write your feedback.');    return; }
    setFbSubmit(true);
    try {
      const res  = await fetch(`${BACKEND}/api/feedback`, {
        method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ rating: fbRating, category: fbCategory, title: fbTitle.trim(), message: fbMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setFbErr(data.message || 'Could not submit feedback.'); return; }
      setFbDone(true); setFbRating(0); setFbCategory('General'); setFbTitle(''); setFbMessage('');
      fetchAll();
    } catch { setFbErr('Cannot connect to backend. Make sure node server.js is running!'); }
    finally { setFbSubmit(false); }
  }

  // ── Process uploaded image ─────────────────────
  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = e => setImage(e.target.result);
    r.readAsDataURL(file);
  }

  const pageTitle = {
    dashboard:'📊 Dashboard', diagnose:'🔬 New Diagnosis',
    history:'📋 Diagnosis History', tips:'🌱 Plant Care Tips',
    feedback:'💬 Feedback', profile:'👤 My Profile', settings:'⚙️ Settings',
  }[menu] || '📊 Dashboard';

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading">
        <div className="spinner"></div>
        <div style={{fontSize:'0.9rem',color:'#6b7280'}}>Loading your dashboard...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="dash-layout">

        {/* ══ SIDEBAR ══ */}
        <aside className="sidebar">
          <Link to="/" className="sb-logo">
            <div className="sb-logo-icon">🌿</div>
            <span className="sb-logo-text">Agro<span>Guide</span> AI</span>
          </Link>

          <div className="sb-user">
            <div className="sb-avatar">{initials}</div>
            <div>
              <div className="sb-uname">{displayName}</div>
              <div className="sb-urole">{roleLabel}</div>
            </div>
          </div>

          <nav className="sb-nav">
            <div className="sb-section">Main Menu</div>
            {[
              { id:'dashboard', icon:'🏠', label:'Dashboard' },
              { id:'diagnose',  icon:'🔬', label:'New Diagnosis', badge:'AI' },
              { id:'history',   icon:'📋', label:'History', badge: diagnoses.length },
              { id:'tips',      icon:'🌱', label:'Plant Care Tips' },
              { id:'feedback',  icon:'💬', label:'Give Feedback', badge:'New' },
            ].map(item => (
              <a key={item.id}
                className={`sb-item ${menu===item.id?'active':''}`}
                onClick={() => { setMenu(item.id); setError(''); setSuccess(''); }}>
                <span className="sb-icon">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && <span className="sb-badge">{item.badge}</span>}
              </a>
            ))}

            <div className="sb-section">Account</div>
            {[
              { id:'profile',  icon:'👤', label:'My Profile' },
              { id:'settings', icon:'⚙️', label:'Settings'   },
            ].map(item => (
              <a key={item.id}
                className={`sb-item ${menu===item.id?'active':''}`}
                onClick={() => setMenu(item.id)}>
                <span className="sb-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="sb-bottom">
            <button className="logout-btn" onClick={logout}>🚪 Sign Out</button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="main">
          <div className="topbar">
            <div>
              <div className="tb-title">{pageTitle}</div>
              <div className="tb-date">{time.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
            </div>
            <div className="tb-right">
              <div className="tb-btn">🔔</div>
              <div className="tb-btn" onClick={fetchAll}>🔄</div>
              <div className="tb-user" onClick={() => setMenu('profile')}>
                <div className="tb-avatar">{initials}</div>
                <span className="tb-name">{profile?.firstName || user?.firstName}</span>
              </div>
            </div>
          </div>

          <div className="page">
            {error   && <div className="alert-err">⚠️ {error}</div>}
            {success && <div className="alert-ok">✅ {success}</div>}

            {/* ════ DASHBOARD HOME ════ */}
            {menu==='dashboard' && <>
              <div className="welcome">
                <div>
                  <div className="welcome-h">{greeting()}, {profile?.firstName || user?.firstName}! 👋</div>
                  <div className="welcome-p">Welcome back to AgroGuide AI. Upload a plant photo to get an instant AI-powered diagnosis and personalised care plan.</div>
                </div>
                <button className="welcome-cta" onClick={() => setMenu('diagnose')}>📷 Diagnose Plant Now</button>
              </div>

              <div className="stats-grid">
                <div className="stat-card sc-g"><div className="stat-icon si-g">🔬</div><span className="stat-val">{stats?.totalDiagnoses ?? 0}</span><span className="stat-lbl">Total Diagnoses</span><div className="stat-sub">From your MySQL database</div></div>
                <div className="stat-card sc-b"><div className="stat-icon si-b">🌿</div><span className="stat-val">{stats?.plantsMonitored ?? 0}</span><span className="stat-lbl">Plants Monitored</span><div className="stat-sub">Unique plant types</div></div>
                <div className="stat-card sc-a"><div className="stat-icon si-a">✅</div><span className="stat-val">{stats?.treated ?? 0}</span><span className="stat-lbl">Plants Treated</span><div className="stat-sub">Successfully treated</div></div>
                <div className="stat-card sc-p"><div className="stat-icon si-p">⏳</div><span className="stat-val">{stats?.pending ?? 0}</span><span className="stat-lbl">Pending Analysis</span><div className="stat-sub">Awaiting AI result</div></div>
              </div>

              <div className="g2">
                <div className="card">
                  <div className="card-h">
                    <div className="card-t">🕐 Recent Diagnoses</div>
                    <button className="card-a" onClick={() => setMenu('history')}>View All →</button>
                  </div>
                  <div className="card-b">
                    {diagnoses.length === 0 ? (
                      <div className="empty"><span className="empty-icon">🌿</span><div className="empty-title">No diagnoses yet</div><div className="empty-desc">Click New Diagnosis to get started!</div></div>
                    ) : diagnoses.slice(0,5).map(d => (
                      <div className="d-row" key={d.id}>
                        <div className="d-icon">{getPlantIcon(d.plantName)}</div>
                        <div className="d-info">
                          <div className="d-plant">{d.plantName}</div>
                          <div className="d-disease">{d.diseaseName}</div>
                          <div className="d-date">{formatDate(d.createdAt)}</div>
                        </div>
                        <span className={`d-badge db-${d.status}`}>{d.status?.charAt(0).toUpperCase()+d.status?.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="vcol">
                  <div className="card">
                    <div className="card-h"><div className="card-t">⚡ Quick Actions</div></div>
                    <div className="card-b">
                      <div className="qa-grid">
                        {[
                          {icon:'📷',bg:'#dcfce7',t:'New Diagnosis',d:'Upload plant photo',   id:'diagnose'},
                          {icon:'📋',bg:'#dbeafe',t:'View History', d:'Past diagnoses',        id:'history'},
                          {icon:'💬',bg:'#f0fdf4',t:'Give Feedback',d:'Share your experience', id:'feedback'},
                          {icon:'👤',bg:'#ede9fe',t:'My Profile',   d:'Account settings',       id:'profile'},
                        ].map((q,i) => (
                          <div className="qa-item" key={i} onClick={() => setMenu(q.id)}>
                            <div className="qa-icon" style={{background:q.bg}}>{q.icon}</div>
                            <div><div className="qa-t">{q.t}</div><div className="qa-d">{q.d}</div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-h"><div className="card-t">💡 Today's Tip</div></div>
                    <div className="card-b">
                      <div className="tip-row">
                        <div className="tip-icon" style={{width:'44px',height:'44px',fontSize:'1.4rem'}}>💧</div>
                        <div>
                          <div className="tip-t">Water Early Morning</div>
                          <div className="tip-d">Water your plants early in the morning to reduce fungal disease risk and improve absorption throughout the day.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>}

            {/* ════ NEW DIAGNOSIS ════ */}
            {menu==='diagnose' && (
              <div className="g2">
                <div className="card">
                  <div className="card-h"><div className="card-t">🔬 Submit New Diagnosis</div></div>
                  <div className="card-b">
                    {diagErr && <div className="alert-err">⚠️ {diagErr}</div>}
                    {diagMsg && <div className="alert-ok">✅ {diagMsg}</div>}
                    {!diagDone ? (
                      <>
                        <div className="form-group">
                          <label className="form-label">Plant Name *</label>
                          <input className="form-input" type="text" placeholder="e.g. Tomato, Potato, Corn..." value={plantName} onChange={e => setPlantName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Plant Type</label>
                          <select className="form-select" value={plantName} onChange={e => setPlantName(e.target.value)}>
                            <option value="">-- Select or type above --</option>
                            <option value="Tomato">🍅 Tomato</option>
                            <option value="Potato">🥔 Potato</option>
                            <option value="Corn">🌽 Corn</option>
                            <option value="Pepper">🌶️ Pepper</option>
                            <option value="Apple">🍎 Apple</option>
                            <option value="Grape">🍇 Grape</option>
                            <option value="Rice">🌾 Rice</option>
                            <option value="Strawberry">🍓 Strawberry</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Additional Notes (optional)</label>
                          <textarea className="form-textarea" placeholder="Describe the symptoms you see on your plant..." value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Plant Photo (optional)</label>
                          <div className="upload-area"
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
                            onClick={() => document.getElementById('plantPhoto').click()}
                          >
                            {image ? (
                              <>
                                <img src={image} alt="Plant" style={{maxWidth:'100%',maxHeight:'180px',borderRadius:'12px',marginBottom:'0.75rem'}} />
                                <div style={{fontSize:'0.85rem',color:'#16a34a',fontWeight:'600'}}>✅ Photo ready!</div>
                              </>
                            ) : (
                              <>
                                <span className="up-icon">📷</span>
                                <div className="up-title">Drop plant photo here</div>
                                <div className="up-desc">Take a clear photo of the affected leaf</div>
                              </>
                            )}
                            <input id="plantPhoto" type="file" accept="image/*" style={{display:'none'}} onChange={e => processFile(e.target.files[0])} />
                          </div>
                        </div>
                        <button className="green-btn" style={{width:'100%'}} onClick={submitDiagnosis} disabled={submitting}>
                          {submitting ? '⏳ Submitting...' : '🔬 Submit for Diagnosis'}
                        </button>
                        <div className="ai-pending" style={{marginTop:'1rem'}}>
                          <span className="ai-pending-icon">🤖</span>
                          <div className="ai-pending-title">AI Model Not Connected Yet</div>
                          <div className="ai-pending-desc">Your diagnosis will be saved as Pending AI Analysis. When your Python model is connected it will fill in the results automatically!</div>
                        </div>
                      </>
                    ) : (
                      <div className="submitted-box">
                        <span className="submitted-icon">✅</span>
                        <div className="submitted-title">Diagnosis Submitted!</div>
                        <div className="submitted-desc">Saved to your MySQL database successfully.</div>
                        <button className="green-btn" onClick={() => { setDiagDone(false); setDiagMsg(''); setDiagErr(''); }}>+ Submit Another</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="vcol">
                  <div className="card">
                    <div className="card-h"><div className="card-t">📸 Photo Tips</div></div>
                    <div className="card-b">
                      {[
                        {icon:'☀️',t:'Take in natural daylight for best accuracy'},
                        {icon:'🎯',t:'Focus clearly on the affected leaf area'},
                        {icon:'📐',t:'Include the whole leaf if possible'},
                        {icon:'🚫',t:'Avoid blurry or dark photos'},
                        {icon:'💧',t:'Wipe water off leaf before photographing'},
                      ].map((t,i) => (
                        <div className="tip-row" key={i}>
                          <div className="tip-icon">{t.icon}</div>
                          <div className="tip-d">{t.t}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-h"><div className="card-t">🤖 AI Models</div></div>
                    <div className="card-b">
                      {[
                        {name:'EfficientNet',acc:'98%',bg:'#dcfce7'},
                        {name:'ResNet50',    acc:'96%',bg:'#dbeafe'},
                        {name:'MobileNetV2', acc:'94%',bg:'#fef3c7'},
                      ].map((m,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid #f3f4f6'}}>
                          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:m.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>🔬</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'0.88rem',fontWeight:'600',color:'#111827'}}>{m.name}</div>
                            <div style={{fontSize:'0.75rem',color:'#6b7280'}}>🔄 Connecting...</div>
                          </div>
                          <span style={{fontSize:'0.72rem',background:'#fef3c7',color:'#92400e',padding:'2px 8px',borderRadius:'8px',fontWeight:'600'}}>Soon</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ HISTORY ════ */}
            {menu==='history' && (
              <div className="card">
                <div className="card-h">
                  <div className="card-t">📋 All Diagnosis History ({diagnoses.length})</div>
                  <button className="card-a" onClick={() => setMenu('diagnose')}>+ New Diagnosis</button>
                </div>
                <div className="card-b">
                  {diagnoses.length === 0 ? (
                    <div className="empty"><span className="empty-icon">🌿</span><div className="empty-title">No diagnoses yet</div><div className="empty-desc">Submit your first plant diagnosis!</div></div>
                  ) : diagnoses.map(d => (
                    <div className="d-row" key={d.id}>
                      <div className="d-icon">{getPlantIcon(d.plantName)}</div>
                      <div className="d-info">
                        <div className="d-plant">{d.plantName}</div>
                        <div className="d-disease">{d.diseaseName}</div>
                        <div className="d-date">📅 {formatDate(d.createdAt)}{d.confidence > 0 && ` · 🎯 ${d.confidence}% confidence`}{d.notes && ` · 📝 ${d.notes}`}</div>
                      </div>
                      <span className={`d-badge db-${d.status}`}>{d.status?.charAt(0).toUpperCase()+d.status?.slice(1)}</span>
                      <button onClick={() => deleteDiag(d.id)} style={{marginLeft:'8px',background:'none',border:'none',cursor:'pointer',color:'#dc2626',fontSize:'1rem',flexShrink:0}} title="Delete">🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ CARE TIPS ════ */}
            {menu==='tips' && (
              <div className="g2eq">
                {[
                  {icon:'💧',t:'Water Early Morning',   d:'Water plants early morning to reduce fungal disease risk and improve water absorption.'},
                  {icon:'🌞',t:'Ensure Good Sunlight',  d:'Most plants need 6-8 hours of direct sunlight daily for healthy growth.'},
                  {icon:'✂️',t:'Prune Infected Leaves', d:'Remove and dispose of infected leaves immediately to stop disease spreading.'},
                  {icon:'🌱',t:'Check Soil Health',      d:'Test soil pH monthly. Most plants thrive in pH 6.0 to 7.0 range.'},
                ].map((tip,i) => (
                  <div className="card" key={i}>
                    <div className="card-b">
                      <div className="tip-row">
                        <div className="tip-icon" style={{width:'50px',height:'50px',fontSize:'1.6rem'}}>{tip.icon}</div>
                        <div>
                          <div className="tip-t" style={{fontSize:'1rem',marginBottom:'6px'}}>{tip.t}</div>
                          <div className="tip-d" style={{fontSize:'0.88rem',lineHeight:'1.7'}}>{tip.d}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card">
                  <div className="card-h"><div className="card-t">🌿 Disease Prevention</div></div>
                  <div className="card-b">
                    {['Rotate crops every season to prevent soil-borne diseases','Use disease-resistant plant varieties when possible','Inspect plants weekly for early signs of disease','Keep garden tools clean and disinfected always','Avoid working in the garden when plants are wet'].map((t,i) => (
                      <div key={i} style={{display:'flex',gap:'8px',padding:'8px 0',borderBottom:'1px solid #f3f4f6',fontSize:'0.88rem',color:'#374151',alignItems:'flex-start'}}>
                        <span style={{color:'#16a34a',fontWeight:'700',flexShrink:0}}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="card-h"><div className="card-t">📅 Seasonal Care</div></div>
                  <div className="card-b">
                    {[
                      {e:'🌸',s:'Spring',t:'Start seeds indoors and prepare soil with compost.'},
                      {e:'☀️',s:'Summer',t:'Water deeply and watch for heat stress and pests.'},
                      {e:'🍂',s:'Autumn',t:'Harvest crops and clean up garden debris.'},
                      {e:'❄️',s:'Winter',t:'Plan next season and maintain your tools.'},
                    ].map((s,i) => (
                      <div className="tip-row" key={i}>
                        <div className="tip-icon" style={{fontSize:'1.4rem'}}>{s.e}</div>
                        <div><div className="tip-t">{s.s}</div><div className="tip-d">{s.t}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ FEEDBACK ════ */}
            {menu==='feedback' && (
              <div className="g2">
                {/* Submit Feedback Form */}
                <div>
                  <div className="card" style={{marginBottom:'1.5rem'}}>
                    <div className="card-h"><div className="card-t">💬 Share Your Feedback</div></div>
                    <div className="card-b">
                      {fbErr  && <div className="alert-err">⚠️ {fbErr}</div>}

                      {!fbDone ? (
                        <>
                          {/* Star Rating */}
                          <div className="form-group">
                            <label className="form-label">Your Rating *</label>
                            <div className="star-row">
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  className={`star-btn ${(fbHover || fbRating) >= star ? 'active' : ''}`}
                                  onMouseEnter={() => setFbHover(star)}
                                  onMouseLeave={() => setFbHover(0)}
                                  onClick={() => setFbRating(star)}
                                >
                                  ⭐
                                </button>
                              ))}
                              {fbRating > 0 && (
                                <span style={{fontSize:'0.85rem',color:'#6b7280',alignSelf:'center',marginLeft:'8px'}}>
                                  {fbRating === 1 ? 'Poor' : fbRating === 2 ? 'Fair' : fbRating === 3 ? 'Good' : fbRating === 4 ? 'Very Good' : 'Excellent!'} ({fbRating}/5)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Category */}
                          <div className="form-group">
                            <label className="form-label">Feedback Category *</label>
                            <select className="form-select" value={fbCategory} onChange={e => setFbCategory(e.target.value)}>
                              <option value="General">💬 General Feedback</option>
                              <option value="AI Diagnosis">🔬 AI Diagnosis Accuracy</option>
                              <option value="Care Tips">🌱 Care Recommendations</option>
                              <option value="UI Design">🎨 UI Design and Usability</option>
                              <option value="Performance">⚡ App Performance</option>
                              <option value="Feature Request">💡 Feature Request</option>
                              <option value="Bug Report">🐛 Bug Report</option>
                            </select>
                          </div>

                          {/* Title */}
                          <div className="form-group">
                            <label className="form-label">Feedback Title *</label>
                            <input
                              className="form-input"
                              type="text"
                              placeholder="e.g. Great AI diagnosis accuracy!"
                              value={fbTitle}
                              onChange={e => setFbTitle(e.target.value)}
                            />
                          </div>

                          {/* Message */}
                          <div className="form-group">
                            <label className="form-label">Your Message *</label>
                            <textarea
                              className="form-textarea"
                              placeholder="Share your experience using AgroGuide AI. What did you love? What can we improve? Your feedback helps us make the app better for all farmers and home gardeners!"
                              value={fbMessage}
                              onChange={e => setFbMessage(e.target.value)}
                              style={{minHeight:'140px'}}
                            />
                          </div>

                          <button
                            className="green-btn"
                            style={{width:'100%'}}
                            onClick={submitFeedback}
                            disabled={fbSubmitting}
                          >
                            {fbSubmitting ? '⏳ Submitting...' : '💬 Submit Feedback'}
                          </button>

                          <div style={{marginTop:'1rem',padding:'1rem',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'12px',fontSize:'0.85rem',color:'#15803d',lineHeight:'1.6'}}>
                            💡 <strong>Your feedback matters!</strong> Every submission helps us improve AgroGuide AI for farmers and home gardeners worldwide. Thank you for taking the time to share your experience!
                          </div>
                        </>
                      ) : (
                        <div className="submitted-box">
                          <span className="submitted-icon">🎉</span>
                          <div className="submitted-title">Thank You for Your Feedback!</div>
                          <div className="submitted-desc">Your feedback has been saved to our database. We will use it to make AgroGuide AI even better for farmers and home gardeners!</div>
                          <button className="green-btn" onClick={() => { setFbDone(false); setFbErr(''); }}>+ Submit Another Feedback</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* My Feedback History */}
                <div>
                  <div className="card">
                    <div className="card-h">
                      <div className="card-t">📋 My Feedback ({feedbacks.length})</div>
                    </div>
                    <div className="card-b">
                      {feedbacks.length === 0 ? (
                        <div className="empty">
                          <span className="empty-icon">💬</span>
                          <div className="empty-title">No feedback yet</div>
                          <div className="empty-desc">Submit your first feedback using the form on the left!</div>
                        </div>
                      ) : feedbacks.map(fb => (
                        <div className="fb-item" key={fb.id}>
                          <div className="fb-header">
                            <div className="fb-user">
                              <div className="fb-ava">{initials}</div>
                              <div>
                                <div className="fb-uname">{displayName}</div>
                                <div className="fb-role">{roleLabel}</div>
                              </div>
                            </div>
                            <div style={{textAlign:'right'}}>
                              <div className="fb-stars">{'⭐'.repeat(fb.rating)}</div>
                              <div className="fb-date">{formatDate(fb.createdAt)}</div>
                            </div>
                          </div>
                          <div className="fb-cat">{fb.category}</div>
                          <div style={{fontSize:'0.92rem',fontWeight:'700',color:'#111827',marginBottom:'6px'}}>{fb.title}</div>
                          <div className="fb-text">{fb.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ PROFILE ════ */}
            {menu==='profile' && (
              <div className="g2eq">
                <div className="card">
                  <div className="card-h">
                    <div className="card-t">👤 My Profile</div>
                    <button className="card-a" onClick={() => { setEditMode(!editMode); setProfMsg(''); setProfErr(''); }}>
                      {editMode ? 'Cancel' : '✏️ Edit'}
                    </button>
                  </div>
                  <div className="card-b">
                    {profMsg && <div className="alert-ok">{profMsg}</div>}
                    {profErr && <div className="alert-err">⚠️ {profErr}</div>}
                    {!editMode ? (
                      <div className="prof-center">
                        <div className="prof-avatar">{initials}</div>
                        <div className="prof-name">{displayName}</div>
                        <div className="prof-email">{profile?.email}</div>
                        <div className="prof-role">{roleLabel}</div>
                        <div className="prof-stats">
                          <div className="ps-box"><span className="ps-v">{stats?.totalDiagnoses ?? 0}</span><span className="ps-l">Diagnoses</span></div>
                          <div className="ps-box"><span className="ps-v">{stats?.plantsMonitored ?? 0}</span><span className="ps-l">Plants</span></div>
                          <div className="ps-box"><span className="ps-v">{stats?.treated ?? 0}</span><span className="ps-l">Treated</span></div>
                          <div className="ps-box"><span className="ps-v">{feedbacks.length}</span><span className="ps-l">Feedbacks</span></div>
                        </div>
                        <button className="green-btn" style={{width:'100%',marginTop:'1rem'}} onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
                      </div>
                    ) : (
                      <>
                        <div className="form-group"><label className="form-label">First Name</label><input className="form-input" type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm,firstName:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" type="text" value={editForm.lastName}  onChange={e => setEditForm({...editForm,lastName:e.target.value})}  /></div>
                        <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" value={editForm.email} onChange={e => setEditForm({...editForm,email:e.target.value})} /></div>
                        <button className="green-btn" style={{width:'100%'}} onClick={saveProfile} disabled={saving}>{saving ? '⏳ Saving...' : '💾 Save Changes'}</button>
                      </>
                    )}
                  </div>
                </div>
                <div className="card">
                  <div className="card-h"><div className="card-t">📋 Account Details</div></div>
                  <div className="card-b">
                    {[
                      {l:'Full Name',    v:displayName},
                      {l:'Email',        v:profile?.email},
                      {l:'Role',         v:roleLabel},
                      {l:'Member Since', v:formatDate(profile?.createdAt)},
                      {l:'Total Diagnoses', v:stats?.totalDiagnoses ?? 0},
                      {l:'Feedbacks Given', v:feedbacks.length},
                      {l:'Plan',         v:'Free — always free 🌿'},
                    ].map((x,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f8fafc',fontSize:'0.88rem'}}>
                        <span style={{color:'#6b7280',fontWeight:'500'}}>{x.l}</span>
                        <span style={{color:'#111827',fontWeight:'600'}}>{x.v}</span>
                      </div>
                    ))}
                    <button className="logout-btn" style={{marginTop:'1.5rem'}} onClick={logout}>🚪 Sign Out</button>
                  </div>
                </div>
              </div>
            )}

            {/* ════ SETTINGS ════ */}
            {menu==='settings' && (
              <div className="card">
                <div className="card-h"><div className="card-t">⚙️ Settings</div></div>
                <div className="card-b">
                  {[
                    {icon:'🔔',t:'Notifications',  d:'Email alerts for diagnosis results and care reminders'},
                    {icon:'🌐',t:'Language',        d:'Change the display language of AgroGuide AI'},
                    {icon:'🎨',t:'Theme',           d:'Switch between light and dark display mode'},
                    {icon:'🔒',t:'Privacy',         d:'Control your data and privacy settings'},
                    {icon:'📧',t:'Email Updates',   d:'Receive weekly plant care tips by email'},
                  ].map((s,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 0',borderBottom:'1px solid #f3f4f6'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{width:'42px',height:'42px',borderRadius:'12px',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>{s.icon}</div>
                        <div>
                          <div style={{fontSize:'0.9rem',fontWeight:'600',color:'#111827'}}>{s.t}</div>
                          <div style={{fontSize:'0.8rem',color:'#6b7280'}}>{s.d}</div>
                        </div>
                      </div>
                      <div className="toggle"><div className="toggle-dot"></div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}