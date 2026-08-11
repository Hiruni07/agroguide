import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f8fafc; }

  .layout { display: flex; min-height: 100vh; }

  /* ══ SIDEBAR ══ */
  .sidebar {
    width: 270px; flex-shrink: 0;
    background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh;
    z-index: 100; overflow-y: auto;
    box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  }
  .sb-top {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .sb-brand {
    display: flex; align-items: center; gap: 12px;
    text-decoration: none; margin-bottom: 1.2rem;
  }
  .sb-brand-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-radius: 14px; display: flex; align-items: center;
    justify-content: center; font-size: 22px;
    box-shadow: 0 4px 14px rgba(139,92,246,0.5);
  }
  .sb-brand-name { font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1.2; }
  .sb-brand-sub  { font-size: 0.7rem; color: rgba(255,255,255,0.5); font-weight: 500; }

  .sb-user-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .sb-user-ava {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
    border: 2px solid rgba(139,92,246,0.4);
  }
  .sb-user-name { font-size: 0.85rem; font-weight: 600; color: #fff; }
  .sb-user-role { font-size: 0.7rem; color: #a78bfa; margin-top: 1px; }

  .sb-nav { padding: 1.2rem 1rem; flex: 1; }
  .sb-nav-label {
    font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.35);
    text-transform: uppercase; letter-spacing: 1.5px;
    padding: 0 0.5rem; margin: 1rem 0 0.4rem;
  }
  .sb-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 0.7rem 0.9rem; border-radius: 12px;
    color: rgba(255,255,255,0.6); font-size: 0.88rem;
    font-weight: 500; cursor: pointer; transition: all 0.2s;
    text-decoration: none; margin-bottom: 2px;
    border: 1px solid transparent;
  }
  .sb-nav-item:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }
  .sb-nav-item.active {
    background: rgba(139,92,246,0.25);
    border-color: rgba(139,92,246,0.4);
    color: #c4b5fd; font-weight: 600;
  }
  .sb-nav-icon { font-size: 1.05rem; width: 22px; text-align: center; flex-shrink: 0; }
  .sb-nav-badge {
    margin-left: auto; font-size: 0.68rem; font-weight: 700;
    padding: 2px 8px; border-radius: 20px;
    background: rgba(139,92,246,0.3); color: #c4b5fd;
  }
  .sb-nav-badge.red { background: rgba(239,68,68,0.3); color: #fca5a5; }

  .sb-bottom {
    padding: 1rem 1.2rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .sb-logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 0.75rem 1rem; border-radius: 12px;
    background: rgba(239,68,68,0.12); color: #fca5a5;
    border: 1px solid rgba(239,68,68,0.2); font-size: 0.88rem;
    font-weight: 600; cursor: pointer; font-family: inherit;
    transition: all 0.2s;
  }
  .sb-logout:hover { background: rgba(239,68,68,0.22); color: #f87171; }

  /* ══ MAIN ══ */
  .main { margin-left: 270px; flex: 1; display: flex; flex-direction: column; }

  /* ── TOPBAR ── */
  .topbar {
    background: #fff; padding: 0.85rem 2rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 12px rgba(0,0,0,0.05);
  }
  .tb-left h1 { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
  .tb-left p  { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
  .tb-right { display: flex; align-items: center; gap: 10px; }
  .tb-icon-btn {
    width: 38px; height: 38px; border-radius: 10px;
    background: #f8fafc; border: 1px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; transition: all 0.2s;
  }
  .tb-icon-btn:hover { background: #f5f3ff; border-color: #8b5cf6; }
  .admin-chip {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: #fff; font-size: 0.78rem; font-weight: 700;
    padding: 5px 14px; border-radius: 20px;
    box-shadow: 0 2px 8px rgba(124,58,237,0.35);
  }

  /* ── PAGE ── */
  .page { padding: 1.8rem 2rem; flex: 1; }

  /* ── LOADING ── */
  .loading {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    background: #f8fafc;
  }
  .spinner {
    width: 44px; height: 44px;
    border: 3px solid #e2e8f0; border-top-color: #7c3aed;
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading p { font-size: 0.9rem; color: #94a3b8; font-family: 'Inter', sans-serif; }

  /* ── ALERTS ── */
  .alert {
    display: flex; align-items: center; gap: 10px;
    padding: 0.9rem 1.2rem; border-radius: 12px;
    font-size: 0.88rem; font-weight: 500; margin-bottom: 1.5rem;
  }
  .alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
  .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }

  /* ── STAT CARDS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1.2rem; margin-bottom: 2rem;
  }
  .stat {
    background: #fff; border-radius: 18px; padding: 1.4rem;
    border: 1px solid #f1f5f9; transition: all 0.3s;
    position: relative; overflow: hidden;
  }
  .stat:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.08); }
  .stat-glow {
    position: absolute; top: -30px; right: -30px;
    width: 100px; height: 100px; border-radius: 50%; opacity: 0.08;
  }
  .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .stat-icon-wrap {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  }
  .stat-trend {
    font-size: 0.72rem; font-weight: 700; padding: 3px 8px;
    border-radius: 8px; display: flex; align-items: center; gap: 3px;
  }
  .trend-up   { background: #f0fdf4; color: #16a34a; }
  .trend-down { background: #fef2f2; color: #dc2626; }
  .trend-neu  { background: #f8fafc; color: #64748b; }
  .stat-val { font-size: 2.2rem; font-weight: 900; color: #0f172a; display: block; letter-spacing: -1px; }
  .stat-lbl { font-size: 0.82rem; color: #64748b; font-weight: 500; margin-top: 4px; display: block; }

  /* ── SECTION HEADER ── */
  .sec-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.2rem;
  }
  .sec-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .sec-action {
    font-size: 0.82rem; color: #7c3aed; font-weight: 600;
    cursor: pointer; background: none; border: none; font-family: inherit;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── CARD ── */
  .card {
    background: #fff; border-radius: 20px;
    border: 1px solid #f1f5f9; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .card-head {
    padding: 1.1rem 1.5rem; border-bottom: 1px solid #f8fafc;
    display: flex; align-items: center; justify-content: space-between;
    background: #fdfdfe;
  }
  .card-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .card-body  { padding: 1.5rem; }

  /* ── SEARCH ── */
  .search-wrap { position: relative; margin-bottom: 1.2rem; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #94a3b8; }
  .search-input {
    width: 100%; padding: 0.7rem 1rem 0.7rem 2.8rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    font-size: 0.9rem; outline: none; color: #0f172a;
    background: #f8fafc; font-family: inherit; transition: all 0.2s;
  }
  .search-input:focus { border-color: #7c3aed; background: #fff; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }

  /* ── TABLE ── */
  .tbl-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #f8fafc; }
  th {
    text-align: left; padding: 10px 14px;
    font-size: 0.72rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.8px;
    border-bottom: 1px solid #f1f5f9; white-space: nowrap;
  }
  td {
    padding: 13px 14px; font-size: 0.88rem; color: #374151;
    border-bottom: 1px solid #f8fafc; vertical-align: middle;
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: #faf8ff; }

  .user-cell { display: flex; align-items: center; gap: 10px; }
  .uc-ava {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    border: 2px solid #ede9fe;
  }
  .uc-name  { font-size: 0.88rem; font-weight: 600; color: #0f172a; }
  .uc-email { font-size: 0.76rem; color: #94a3b8; margin-top: 1px; }

  .role-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.74rem; font-weight: 600; padding: 3px 10px;
    border-radius: 20px; white-space: nowrap;
  }
  .rp-farmer   { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .rp-gardener { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
  .rp-admin    { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }

  .status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.74rem; font-weight: 600; padding: 3px 10px;
    border-radius: 20px; white-space: nowrap;
  }
  .sp-treated  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .sp-pending  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
  .sp-critical { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

  /* ── ACTION BUTTONS ── */
  .acts { display: flex; gap: 6px; align-items: center; }
  .btn-edit {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border-radius: 8px; font-size: 0.76rem; font-weight: 600;
    background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-edit:hover { background: #7c3aed; color: #fff; border-color: #7c3aed; }
  .btn-del {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border-radius: 8px; font-size: 0.76rem; font-weight: 600;
    background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-del:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

  /* ── GRID LAYOUTS ── */
  .g2    { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
  .g2eq  { display: grid; grid-template-columns: 1fr 1fr;   gap: 1.5rem; margin-bottom: 2rem; }
  .g3    { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-bottom: 2rem; }

  /* ── BAR CHART ── */
  .bar-item { margin-bottom: 1.2rem; }
  .bar-top  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .bar-lbl  { font-size: 0.82rem; font-weight: 500; color: #374151; display: flex; align-items: center; gap: 6px; }
  .bar-val  { font-size: 0.82rem; font-weight: 700; color: #0f172a; }
  .bar-track { background: #f1f5f9; border-radius: 8px; height: 8px; overflow: hidden; }
  .bar-fill  { height: 100%; border-radius: 8px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* ── RECENT LIST ── */
  .rl-item {
    display: flex; align-items: center; gap: 12px;
    padding: 0.85rem 0; border-bottom: 1px solid #f8fafc;
  }
  .rl-item:last-child { border-bottom: none; }
  .rl-icon {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
    border: 1px solid #ddd6fe;
  }
  .rl-name   { font-size: 0.88rem; font-weight: 600; color: #0f172a; }
  .rl-detail { font-size: 0.76rem; color: #94a3b8; margin-top: 1px; }

  /* ── MODAL ── */
  .overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.6);
    z-index: 200; display: flex; align-items: center;
    justify-content: center; padding: 1rem;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: #fff; border-radius: 24px; padding: 2rem;
    width: 100%; max-width: 500px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2);
    animation: popIn 0.2s ease;
  }
  @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-title { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.4rem; }
  .modal-sub   { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem; }
  .modal-btns  { display: flex; gap: 10px; margin-top: 1.5rem; }

  .fg { margin-bottom: 1rem; }
  .fl { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
  .fi {
    width: 100%; padding: 0.65rem 0.9rem; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-size: 0.9rem; outline: none; color: #0f172a;
    background: #f8fafc; font-family: inherit; transition: all 0.2s;
  }
  .fi:focus { border-color: #7c3aed; background: #fff; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }

  .btn-primary {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 0.8rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600;
    background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(124,58,237,0.35);
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(124,58,237,0.45); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-danger {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 0.8rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600;
    background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(220,38,38,0.35);
  }
  .btn-danger:hover:not(:disabled) { transform: translateY(-1px); }
  .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-ghost {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 0.8rem; border-radius: 12px; font-size: 0.9rem; font-weight: 600;
    background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-ghost:hover { background: #f1f5f9; }

  /* ── EMPTY ── */
  .empty { text-align: center; padding: 3.5rem 2rem; }
  .empty-icon  { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
  .empty-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .empty-desc  { font-size: 0.85rem; color: #94a3b8; }

  /* ── SETTINGS ── */
  .setting-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 0; border-bottom: 1px solid #f8fafc;
  }
  .setting-row:last-child { border-bottom: none; }
  .sr-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px; background: #f5f3ff;
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
  }
  .sr-title { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
  .sr-desc  { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
  .toggle {
    width: 46px; height: 26px; border-radius: 13px; background: #7c3aed;
    position: relative; cursor: pointer; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(124,58,237,0.4);
  }
  .toggle-dot {
    width: 20px; height: 20px; background: #fff; border-radius: 50%;
    position: absolute; right: 3px; top: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    transition: all 0.2s;
  }

  /* ── PROFILE CARD ── */
  .prof-card {
    background: linear-gradient(135deg, #1e1b4b, #312e81);
    border-radius: 20px; padding: 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .prof-card::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px; background: rgba(255,255,255,0.05); border-radius: 50%;
  }
  .prof-ava {
    width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 1rem;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 700; color: #fff;
    border: 3px solid rgba(139,92,246,0.4);
    box-shadow: 0 8px 24px rgba(139,92,246,0.4); z-index: 1; position: relative;
  }
  .prof-name  { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .prof-email { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
  .prof-badge {
    display: inline-block; background: rgba(139,92,246,0.3); color: #c4b5fd;
    font-size: 0.76rem; font-weight: 700; padding: 4px 14px; border-radius: 20px;
    border: 1px solid rgba(139,92,246,0.4);
  }
  .prof-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 10px; margin-top: 1.5rem; z-index: 1; position: relative;
  }
  .ps {
    background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 8px;
    border: 1px solid rgba(255,255,255,0.1); text-align: center;
  }
  .ps-v { font-size: 1.4rem; font-weight: 800; color: #fff; display: block; }
  .ps-l { font-size: 0.72rem; color: rgba(255,255,255,0.55); }

  @media (max-width: 1280px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .g2 { grid-template-columns: 1fr; }
    .g3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .g2eq { grid-template-columns: 1fr; }
    .g3 { grid-template-columns: 1fr; }
    .page { padding: 1rem; }
  }
`;

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function initials(first, last) {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem('token');
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [menu,      setMenu]      = useState('overview');
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [time,      setTime]      = useState(new Date());
  const [uSearch,   setUSearch]   = useState('');
  const [dSearch,   setDSearch]   = useState('');

  // Edit modal
  const [editOpen,  setEditOpen]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [editForm,  setEditForm]  = useState({});
  const [eSaving,   setESaving]   = useState(false);

  // Delete modal
  const [delOpen,   setDelOpen]   = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [delType,   setDelType]   = useState('');
  const [deling,    setDeling]    = useState(false);

  // ── Fetch ──────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true); setError('');
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [sRes, uRes, dRes] = await Promise.all([
        fetch(`${BACKEND}/api/admin/stats`,     { headers: h }),
        fetch(`${BACKEND}/api/admin/users`,     { headers: h }),
        fetch(`${BACKEND}/api/admin/diagnoses`, { headers: h }),
      ]);
      if (sRes.status === 401 || sRes.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login'); return;
      }
      setStats(await sRes.json());
      const uData = await uRes.json();
      const dData = await dRes.json();
      setUsers(Array.isArray(uData) ? uData : []);
      setDiagnoses(Array.isArray(dData) ? dData : []);
    } catch {
      setError('Cannot connect to backend. Make sure node server.js is running!');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchAll();
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, [fetchAll]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function flash(msg, isErr = false) {
    isErr ? setError(msg) : setSuccess(msg);
    setTimeout(() => isErr ? setError('') : setSuccess(''), 3500);
  }

  async function doDelete() {
    setDeling(true);
    try {
      const url = delType === 'user'
        ? `${BACKEND}/api/admin/users/${delTarget.id}`
        : `${BACKEND}/api/admin/diagnoses/${delTarget.id}`;
      const res  = await fetch(url, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { flash(data.message, true); return; }
      flash(data.message);
      setDelOpen(false);
      fetchAll();
    } catch { flash('Could not delete. Is backend running?', true); }
    finally   { setDeling(false); }
  }

  async function doEdit() {
    setESaving(true);
    try {
      const res  = await fetch(`${BACKEND}/api/admin/diagnoses/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body:    JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { flash(data.message, true); return; }
      flash('Diagnosis updated!');
      setEditOpen(false);
      fetchAll();
    } catch { flash('Could not update.', true); }
    finally   { setESaving(false); }
  }

  const fUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.role}`
      .toLowerCase().includes(uSearch.toLowerCase())
  );

  const fDiag = diagnoses.filter(d =>
    `${d.plantName} ${d.diseaseName} ${d.firstName} ${d.lastName} ${d.status}`
      .toLowerCase().includes(dSearch.toLowerCase())
  );

  const critCount = diagnoses.filter(d => d.status === 'critical').length;

  const pageTitle = {
    overview: '📊 System Overview',
    users:    '👥 User Management',
    diag:     '🔬 Diagnosis Management',
    settings: '⚙️ Admin Settings',
  }[menu] || '📊 System Overview';

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* ══ SIDEBAR ══ */}
        <aside className="sidebar">
          <div className="sb-top">
            <Link to="/" className="sb-brand">
              <div className="sb-brand-icon">🛡️</div>
              <div>
                <div className="sb-brand-name">AgroGuide AI</div>
                <div className="sb-brand-sub">Admin Control Panel</div>
              </div>
            </Link>
            <div className="sb-user-card">
              <div className="sb-user-ava">{initials(adminUser.firstName, adminUser.lastName)}</div>
              <div>
                <div className="sb-user-name">{adminUser.firstName} {adminUser.lastName}</div>
                <div className="sb-user-role">🛡️ System Administrator</div>
              </div>
            </div>
          </div>

          <nav className="sb-nav">
            <div className="sb-nav-label">Admin Menu</div>
            {[
              { id:'overview', icon:'📊', label:'Overview' },
              { id:'users',    icon:'👥', label:'Users',     badge: users.length },
              { id:'diag',     icon:'🔬', label:'Diagnoses', badge: diagnoses.length, red: critCount > 0 },
            ].map(item => (
              <a key={item.id}
                className={`sb-nav-item ${menu===item.id?'active':''}`}
                onClick={()=>{ setMenu(item.id); setError(''); setSuccess(''); }}>
                <span className="sb-nav-icon">{item.icon}</span>
                {item.label}
                {item.badge !== undefined && (
                  <span className={`sb-nav-badge ${item.red?'red':''}`}>{item.badge}</span>
                )}
              </a>
            ))}

            <div className="sb-nav-label">System</div>
            <a className={`sb-nav-item ${menu==='settings'?'active':''}`}
              onClick={()=>setMenu('settings')}>
              <span className="sb-nav-icon">⚙️</span> Settings
            </a>
            <a className="sb-nav-item" onClick={()=>navigate('/dashboard')}>
              <span className="sb-nav-icon">🌿</span> User Dashboard
            </a>
          </nav>

          <div className="sb-bottom">
            <button className="sb-logout" onClick={logout}>🚪 Sign Out</button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="main">
          <div className="topbar">
            <div className="tb-left">
              <h1>{pageTitle}</h1>
              <p>{time.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
            <div className="tb-right">
              <div className="tb-icon-btn" onClick={fetchAll} title="Refresh data">🔄</div>
              <div className="admin-chip">🛡️ Administrator</div>
            </div>
          </div>

          <div className="page">

            {error   && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {/* ════ OVERVIEW ════ */}
            {menu==='overview' && stats && (
              <>
                {/* Stats Grid */}
                <div className="stats-grid">
                  {[
                    { icon:'👥', label:'Total Users',     val: stats.totalUsers      ?? 0, color:'#7c3aed', bg:'#f5f3ff', glow:'#7c3aed', trend:'All registered', tc:'neu' },
                    { icon:'🌾', label:'Farmers',         val: stats.totalFarmers    ?? 0, color:'#16a34a', bg:'#f0fdf4', glow:'#16a34a', trend:'Farmer accounts', tc:'up' },
                    { icon:'🌱', label:'Home Gardeners',  val: stats.totalGardeners  ?? 0, color:'#2563eb', bg:'#eff6ff', glow:'#2563eb', trend:'Gardener accounts', tc:'up' },
                    { icon:'🔬', label:'Total Diagnoses', val: stats.totalDiagnoses  ?? 0, color:'#0d9488', bg:'#f0fdfa', glow:'#0d9488', trend:'All diagnoses', tc:'neu' },
                    { icon:'✅', label:'Treated',         val: stats.treatedDiagnoses  ?? 0, color:'#16a34a', bg:'#f0fdf4', glow:'#16a34a', trend:'Successfully treated', tc:'up' },
                    { icon:'⏳', label:'Pending',         val: stats.pendingDiagnoses  ?? 0, color:'#d97706', bg:'#fffbeb', glow:'#d97706', trend:'Awaiting AI analysis', tc:'neu' },
                    { icon:'🚨', label:'Critical',        val: stats.criticalDiagnoses ?? 0, color:'#dc2626', bg:'#fef2f2', glow:'#dc2626', trend:'Need urgent care', tc:'down' },
                    { icon:'📈', label:'Success Rate',
                      val: `${stats.totalDiagnoses > 0 ? Math.round((stats.treatedDiagnoses/stats.totalDiagnoses)*100) : 0}%`,
                      color:'#7c3aed', bg:'#f5f3ff', glow:'#7c3aed', trend:'Treatment success', tc:'up' },
                  ].map((s,i) => (
                    <div className="stat" key={i}>
                      <div className="stat-glow" style={{background:s.glow}}></div>
                      <div className="stat-header">
                        <div className="stat-icon-wrap" style={{background:s.bg, fontSize:'1.3rem'}}>{s.icon}</div>
                        <div className={`stat-trend trend-${s.tc}`}>
                          {s.tc==='up'?'↑':s.tc==='down'?'↓':'•'} {s.trend}
                        </div>
                      </div>
                      <span className="stat-val">{s.val}</span>
                      <span className="stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="g2">
                  {/* Recent Users */}
                  <div className="card">
                    <div className="card-head">
                      <div className="card-title">👥 Recent Registrations</div>
                      <button className="sec-action" onClick={()=>setMenu('users')}>View All →</button>
                    </div>
                    <div className="card-body">
                      {users.length === 0 ? (
                        <div className="empty">
                          <span className="empty-icon">👥</span>
                          <div className="empty-title">No users yet</div>
                          <div className="empty-desc">Users will appear here after registration</div>
                        </div>
                      ) : users.slice(0,6).map(u => (
                        <div className="rl-item" key={u.id}>
                          <div className="rl-icon">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                          <div style={{flex:1}}>
                            <div className="rl-name">{u.firstName} {u.lastName}</div>
                            <div className="rl-detail">{u.email}</div>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
                            <span className={`role-pill rp-${u.role}`}>{u.role==='gardener'?'🌱 Gardener':'🌾 Farmer'}</span>
                            <span style={{fontSize:'0.72rem',color:'#94a3b8'}}>{fmtDate(u.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                    <div className="card">
                      <div className="card-head"><div className="card-title">📊 Diagnosis Status</div></div>
                      <div className="card-body">
                        {[
                          { l:'✅ Treated',  v: stats.treatedDiagnoses  ?? 0, c:'#16a34a' },
                          { l:'⏳ Pending',  v: stats.pendingDiagnoses  ?? 0, c:'#d97706' },
                          { l:'🚨 Critical', v: stats.criticalDiagnoses ?? 0, c:'#dc2626' },
                        ].map((b,i) => {
                          const tot = Math.max(stats.totalDiagnoses, 1);
                          const pct = Math.round((b.v / tot) * 100);
                          return (
                            <div className="bar-item" key={i}>
                              <div className="bar-top">
                                <span className="bar-lbl">{b.l}</span>
                                <span className="bar-val">{b.v} ({pct}%)</span>
                              </div>
                              <div className="bar-track">
                                <div className="bar-fill" style={{width:`${pct}%`,background:b.c}}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-head"><div className="card-title">👥 User Types</div></div>
                      <div className="card-body">
                        {[
                          { l:'🌾 Farmers',        v: stats.totalFarmers   ?? 0, c:'#16a34a' },
                          { l:'🌱 Home Gardeners', v: stats.totalGardeners ?? 0, c:'#2563eb' },
                        ].map((b,i) => {
                          const tot = Math.max(stats.totalUsers, 1);
                          const pct = Math.round((b.v / tot) * 100);
                          return (
                            <div className="bar-item" key={i}>
                              <div className="bar-top">
                                <span className="bar-lbl">{b.l}</span>
                                <span className="bar-val">{b.v} ({pct}%)</span>
                              </div>
                              <div className="bar-track">
                                <div className="bar-fill" style={{width:`${pct}%`,background:b.c}}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Diagnoses Table */}
                <div className="card">
                  <div className="card-head">
                    <div className="card-title">🔬 Recent Diagnoses</div>
                    <button className="sec-action" onClick={()=>setMenu('diag')}>View All →</button>
                  </div>
                  <div className="card-body">
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Plant</th>
                            <th>Disease</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diagnoses.length === 0 ? (
                            <tr><td colSpan={5} style={{textAlign:'center',padding:'2rem',color:'#94a3b8'}}>No diagnoses yet</td></tr>
                          ) : diagnoses.slice(0,5).map(d => (
                            <tr key={d.id}>
                              <td>
                                <div className="user-cell">
                                  <div className="uc-ava">{initials(d.firstName, d.lastName)}</div>
                                  <div>
                                    <div className="uc-name">{d.firstName} {d.lastName}</div>
                                    <div className="uc-email">{d.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{fontWeight:'600'}}>{d.plantName}</td>
                              <td style={{maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#64748b'}}>{d.diseaseName}</td>
                              <td><span className={`status-pill sp-${d.status}`}>{d.status?.charAt(0).toUpperCase()+d.status?.slice(1)}</span></td>
                              <td style={{color:'#94a3b8',fontSize:'0.82rem'}}>{fmtDate(d.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ════ USER MANAGEMENT ════ */}
            {menu==='users' && (
              <div className="card">
                <div className="card-head">
                  <div className="card-title">👥 All Users ({fUsers.length})</div>
                  <span style={{fontSize:'0.82rem',color:'#94a3b8'}}>{users.length} total registered</span>
                </div>
                <div className="card-body">
                  <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" type="text"
                      placeholder="Search by name, email or role..."
                      value={uSearch} onChange={e=>setUSearch(e.target.value)} />
                  </div>
                  {fUsers.length === 0 ? (
                    <div className="empty">
                      <span className="empty-icon">🔍</span>
                      <div className="empty-title">No users found</div>
                      <div className="empty-desc">Try a different search term</div>
                    </div>
                  ) : (
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Diagnoses</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fUsers.map(u => {
                            const uDiag = diagnoses.filter(d => String(d.userId) === String(u.id));
                            return (
                              <tr key={u.id}>
                                <td>
                                  <div className="user-cell">
                                    <div className="uc-ava">{initials(u.firstName, u.lastName)}</div>
                                    <div>
                                      <div className="uc-name">{u.firstName} {u.lastName}</div>
                                      <div className="uc-email">{u.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td><span className={`role-pill rp-${u.role}`}>{u.role==='gardener'?'🌱 Gardener':'🌾 Farmer'}</span></td>
                                <td style={{color:'#94a3b8',fontSize:'0.82rem'}}>{fmtDate(u.createdAt)}</td>
                                <td>
                                  <span style={{fontWeight:'600',color:'#0f172a'}}>{uDiag.length}</span>
                                  <span style={{fontSize:'0.78rem',color:'#94a3b8',marginLeft:'4px'}}>diagnoses</span>
                                </td>
                                <td>
                                  <div className="acts">
                                    <button className="btn-del" onClick={()=>{ setDelTarget(u); setDelType('user'); setDelOpen(true); }}>
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════ DIAGNOSIS MANAGEMENT ════ */}
            {menu==='diag' && (
              <div className="card">
                <div className="card-head">
                  <div className="card-title">🔬 All Diagnoses ({fDiag.length})</div>
                  {critCount > 0 && (
                    <span style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca',fontSize:'0.78rem',fontWeight:'700',padding:'4px 12px',borderRadius:'20px'}}>
                      🚨 {critCount} Critical
                    </span>
                  )}
                </div>
                <div className="card-body">
                  <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" type="text"
                      placeholder="Search by plant, disease, user or status..."
                      value={dSearch} onChange={e=>setDSearch(e.target.value)} />
                  </div>
                  {fDiag.length === 0 ? (
                    <div className="empty">
                      <span className="empty-icon">🔬</span>
                      <div className="empty-title">No diagnoses found</div>
                      <div className="empty-desc">Try a different search term</div>
                    </div>
                  ) : (
                    <div className="tbl-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Plant</th>
                            <th>Disease</th>
                            <th>Confidence</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fDiag.map(d => (
                            <tr key={d.id}>
                              <td>
                                <div className="user-cell">
                                  <div className="uc-ava">{initials(d.firstName, d.lastName)}</div>
                                  <div>
                                    <div className="uc-name">{d.firstName} {d.lastName}</div>
                                    <div className="uc-email">{d.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{fontWeight:'600',color:'#0f172a'}}>{d.plantName}</td>
                              <td style={{maxWidth:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#64748b'}}>{d.diseaseName}</td>
                              <td>
                                {d.confidence > 0 ? (
                                  <span style={{fontWeight:'600',color:'#0f172a'}}>{d.confidence}%</span>
                                ) : (
                                  <span style={{color:'#94a3b8',fontSize:'0.82rem'}}>Pending</span>
                                )}
                              </td>
                              <td><span className={`status-pill sp-${d.status}`}>{d.status?.charAt(0).toUpperCase()+d.status?.slice(1)}</span></td>
                              <td style={{color:'#94a3b8',fontSize:'0.82rem'}}>{fmtDate(d.createdAt)}</td>
                              <td>
                                <div className="acts">
                                  <button className="btn-edit" onClick={()=>{
                                    setEditItem(d);
                                    setEditForm({ diseaseName: d.diseaseName, confidence: d.confidence, severity: d.severity, status: d.status });
                                    setEditOpen(true);
                                  }}>✏️ Edit</button>
                                  <button className="btn-del" onClick={()=>{ setDelTarget(d); setDelType('diag'); setDelOpen(true); }}>
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════ SETTINGS ════ */}
            {menu==='settings' && (
              <div className="g2eq">
                <div>
                  <div className="prof-card" style={{marginBottom:'1.5rem'}}>
                    <div className="prof-ava">{initials(adminUser.firstName, adminUser.lastName)}</div>
                    <div className="prof-name">{adminUser.firstName} {adminUser.lastName}</div>
                    <div className="prof-email">{adminUser.email}</div>
                    <div className="prof-badge">🛡️ System Administrator</div>
                    <div className="prof-stats">
                      <div className="ps"><span className="ps-v">{users.length}</span><span className="ps-l">Users</span></div>
                      <div className="ps"><span className="ps-v">{diagnoses.length}</span><span className="ps-l">Diagnoses</span></div>
                      <div className="ps"><span className="ps-v">{critCount}</span><span className="ps-l">Critical</span></div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head"><div className="card-title">📋 Account Info</div></div>
                    <div className="card-body">
                      {[
                        { l:'Full Name',   v:`${adminUser.firstName} ${adminUser.lastName}` },
                        { l:'Email',       v:adminUser.email },
                        { l:'Role',        v:'System Administrator' },
                        { l:'Access',      v:'Full System Access' },
                        { l:'Total Users', v:`${users.length} registered` },
                        { l:'Total Diag',  v:`${diagnoses.length} submitted` },
                      ].map((x,i) => (
                        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f8fafc',fontSize:'0.88rem'}}>
                          <span style={{color:'#94a3b8',fontWeight:'500'}}>{x.l}</span>
                          <span style={{color:'#0f172a',fontWeight:'600'}}>{x.v}</span>
                        </div>
                      ))}
                      <button className="sb-logout" style={{marginTop:'1.2rem'}} onClick={logout}>
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-head"><div className="card-title">⚙️ System Settings</div></div>
                  <div className="card-body">
                    {[
                      { icon:'🔔', t:'Email Notifications', d:'Alerts for new user registrations' },
                      { icon:'🤖', t:'AI Model Status',      d:'Python model connection status' },
                      { icon:'🔒', t:'Two Factor Auth',      d:'Extra security for admin login' },
                      { icon:'📊', t:'Analytics Tracking',   d:'Monitor system usage statistics' },
                      { icon:'💾', t:'Auto Database Backup', d:'Daily MySQL backup schedule' },
                      { icon:'🌐', t:'API Access Logs',      d:'Track all API requests and usage' },
                    ].map((s,i) => (
                      <div className="setting-row" key={i}>
                        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                          <div className="sr-icon-wrap">{s.icon}</div>
                          <div>
                            <div className="sr-title">{s.t}</div>
                            <div className="sr-desc">{s.d}</div>
                          </div>
                        </div>
                        <div className="toggle"><div className="toggle-dot"></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ══ EDIT DIAGNOSIS MODAL ══ */}
      {editOpen && editItem && (
        <div className="overlay" onClick={()=>setEditOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">✏️ Update Diagnosis</div>
            <div className="modal-sub">
              Plant: <strong>{editItem.plantName}</strong> · User: <strong>{editItem.firstName} {editItem.lastName}</strong>
            </div>
            <div className="fg">
              <label className="fl">Disease Name</label>
              <input className="fi" type="text" value={editForm.diseaseName ?? ''}
                onChange={e=>setEditForm({...editForm,diseaseName:e.target.value})} />
            </div>
            <div className="fg">
              <label className="fl">Confidence (%)</label>
              <input className="fi" type="number" min="0" max="100" value={editForm.confidence ?? 0}
                onChange={e=>setEditForm({...editForm,confidence:e.target.value})} />
            </div>
            <div className="fg">
              <label className="fl">Severity</label>
              <select className="fi" value={editForm.severity ?? 'Unknown'}
                onChange={e=>setEditForm({...editForm,severity:e.target.value})}>
                <option value="Unknown">Unknown</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Status</label>
              <select className="fi" value={editForm.status ?? 'pending'}
                onChange={e=>setEditForm({...editForm,status:e.target.value})}>
                <option value="pending">⏳ Pending</option>
                <option value="treated">✅ Treated</option>
                <option value="critical">🚨 Critical</option>
              </select>
            </div>
            <div className="modal-btns">
              <button className="btn-primary" onClick={doEdit} disabled={eSaving}>
                {eSaving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button className="btn-ghost" onClick={()=>setEditOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {delOpen && delTarget && (
        <div className="overlay" onClick={()=>setDelOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">🗑️ Confirm Delete</div>
            <div className="modal-sub">This action cannot be undone.</div>
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'14px',padding:'1.2rem',fontSize:'0.9rem',color:'#374151',lineHeight:'1.7'}}>
              {delType==='user' ? (
                <>Are you sure you want to delete user <strong>{delTarget.firstName} {delTarget.lastName}</strong>?
                This will also delete all their diagnoses permanently.</>
              ) : (
                <>Are you sure you want to delete the diagnosis for <strong>{delTarget.plantName}</strong>
                by <strong>{delTarget.firstName} {delTarget.lastName}</strong>?</>
              )}
            </div>
            <div className="modal-btns">
              <button className="btn-danger" onClick={doDelete} disabled={deling}>
                {deling ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
              </button>
              <button className="btn-ghost" onClick={()=>setDelOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}