import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; }

  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #fff;
  }

  /* LEFT SIDE */
  .login-left {
    background: linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }
  .login-left::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }
  .login-left::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }
  .left-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 3rem;
    z-index: 1;
  }
  .left-logo-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.15);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    backdrop-filter: blur(10px);
  }
  .left-logo-text {
    font-size: 1.6rem; font-weight: 700; color: #fff;
  }
  .left-logo-text span { color: #4ade80; }
  .left-heading {
    font-size: 2.2rem; font-weight: 800; color: #fff;
    line-height: 1.2; margin-bottom: 1.2rem;
    text-align: center; z-index: 1;
    letter-spacing: -0.5px;
  }
  .left-heading span {
    color: #4ade80;
  }
  .left-desc {
    font-size: 1rem; color: rgba(255,255,255,0.75);
    text-align: center; line-height: 1.7;
    max-width: 320px; z-index: 1; margin-bottom: 3rem;
  }
  .left-features { z-index: 1; width: 100%; max-width: 320px; }
  .left-feature {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
  }
  .lf-icon {
    width: 36px; height: 36px;
    background: rgba(74,222,128,0.2);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .lf-text h4 { font-size: 0.88rem; font-weight: 600; color: #fff; margin-bottom: 2px; }
  .lf-text p  { font-size: 0.78rem; color: rgba(255,255,255,0.65); }
  .left-stats {
    display: flex; gap: 2rem; z-index: 1; margin-top: 2rem;
  }
  .lst { text-align: center; }
  .lst-num   { font-size: 1.6rem; font-weight: 800; color: #4ade80; display: block; }
  .lst-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); }

  /* RIGHT SIDE */
  .login-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    background: #fafafa;
  }
  .login-card {
    background: #fff;
    border-radius: 20px;
    padding: 2.8rem;
    width: 100%;
    max-width: 420px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  }
  .card-header { margin-bottom: 2rem; }
  .card-header h2 {
    font-size: 1.7rem; font-weight: 700; color: #111827;
    margin-bottom: 0.4rem; letter-spacing: -0.5px;
  }
  .card-header p { font-size: 0.9rem; color: #6b7280; }
  .card-header p span { color: #16a34a; font-weight: 500; }

  .form-group { margin-bottom: 1.2rem; }
  .form-label {
    display: block; font-size: 0.85rem;
    font-weight: 600; color: #374151; margin-bottom: 6px;
  }
  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); font-size: 16px; color: #9ca3af;
  }
  .form-input {
    width: 100%; padding: 0.7rem 0.9rem 0.7rem 2.8rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 0.95rem; outline: none; color: #111827;
    background: #f9fafb; font-family: inherit;
    transition: all 0.2s;
  }
  .form-input:focus {
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  }
  .form-input::placeholder { color: #d1d5db; }

  .forgot-row {
    display: flex; justify-content: flex-end; margin-top: 6px;
  }
  .forgot-link {
    font-size: 0.82rem; color: #16a34a;
    text-decoration: none; font-weight: 500;
  }
  .forgot-link:hover { text-decoration: underline; }

  .btn-login {
    width: 100%; padding: 0.85rem;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; border: none; border-radius: 10px;
    font-size: 1rem; font-weight: 600; cursor: pointer;
    margin-top: 0.5rem; font-family: inherit;
    box-shadow: 0 4px 15px rgba(22,163,74,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(22,163,74,0.45);
  }
  .btn-login:disabled {
    background: #86efac; cursor: not-allowed;
    transform: none; box-shadow: none;
  }

  .error-msg {
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; padding: 0.7rem 1rem;
    border-radius: 10px; font-size: 0.85rem;
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 8px;
  }
  .success-msg {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    color: #16a34a; padding: 0.7rem 1rem;
    border-radius: 10px; font-size: 0.85rem;
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 8px;
  }

  .divider {
    display: flex; align-items: center;
    gap: 12px; margin: 1.5rem 0; color: #9ca3af; font-size: 0.82rem;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; border-top: 1px solid #e5e7eb;
  }

  .register-row {
    text-align: center; font-size: 0.9rem; color: #6b7280; margin-top: 1.2rem;
  }
  .register-row a {
    color: #16a34a; text-decoration: none; font-weight: 600;
  }
  .register-row a:hover { text-decoration: underline; }

  .back-home {
    text-align: center; margin-top: 0.75rem;
  }
  .back-home a {
    font-size: 0.85rem; color: #9ca3af;
    text-decoration: none; transition: color 0.2s;
  }
  .back-home a:hover { color: #16a34a; }

  .trust-badges {
    display: flex; justify-content: center;
    gap: 1.5rem; margin-top: 1.8rem; flex-wrap: wrap;
  }
  .trust-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.75rem; color: #9ca3af;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @media (max-width: 768px) {
    .login-page { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 2rem 1.5rem; background: linear-gradient(135deg, #f0fdf4, #dcfce7); }
    .login-card { box-shadow: none; border: none; background: transparent; }
  }

  /* AgroGuide sign-in refresh */
  .login-page { min-height: 100vh; grid-template-columns: minmax(360px, .9fr) minmax(500px, 1.1fr); background: #f7f5ed; font-family: 'Inter', 'Segoe UI', sans-serif; }
  .login-left { align-items: flex-start; justify-content: space-between; padding: 42px clamp(2rem, 6vw, 6rem); background: linear-gradient(150deg, rgba(23,63,53,.94), rgba(47,125,74,.84)), url('https://images.unsplash.com/photo-1592982537447-6f2a6a0a5d9b?auto=format&fit=crop&w=1200&q=85') center/cover; }
  .login-left::before { top: -140px; right: -120px; width: 460px; height: 460px; background: rgba(185,217,108,.12); }
  .login-left::after { bottom: -130px; left: -130px; width: 380px; height: 380px; background: rgba(255,255,255,.06); }
  .left-logo { margin-bottom: 0; }.left-logo-icon { width: 45px; height: 45px; border-radius: 14px 14px 14px 4px; background: #b9d96c; color: #173f35; font-size: .8rem; font-weight: 800; transform: rotate(-7deg); }.left-logo-text { font-size: 1.15rem; letter-spacing: -.3px; }.left-logo-text span { color: #b9d96c; }
  .left-heading { align-self: center; width: 100%; max-width: 470px; margin: auto 0 18px; text-align: left; font-family: Georgia, serif; font-size: clamp(2.5rem, 4vw, 4.6rem); line-height: 1.02; letter-spacing: -2px; }.left-heading span { color: #b9d96c; }.left-desc { align-self: center; width: 100%; max-width: 470px; margin: 0 0 32px; text-align: left; color: #d9e8d8; line-height: 1.75; }.left-features { max-width: 470px; }.left-feature { padding: 14px 16px; margin-bottom: 10px; border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.09); }.lf-icon { background: rgba(185,217,108,.2); color: #b9d96c; }.lf-text h4 { font-size: .82rem; }.lf-text p { font-size: .73rem; }.left-stats { margin-top: 12px; gap: 2.5rem; }.lst-num { color: #b9d96c; font-size: 1.35rem; }.lst-label { color: #c8d8c7; font-size: .7rem; }
  .login-right { align-items: center; padding: 42px clamp(1.5rem, 7vw, 7rem); background: #f7f5ed; }.login-card { max-width: 465px; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; }.card-header { margin-bottom: 28px; }.card-header h2 { color: #173f35; font-family: Georgia, serif; font-size: 2.45rem; letter-spacing: -1.3px; }.card-header p { color: #69766e; }.card-header p span { color: #2f7d4a; font-weight: 700; }
  .form-group { margin-bottom: 19px; }.form-label { color: #173f35; font-size: .78rem; letter-spacing: .3px; }.form-input { padding: .9rem 1rem .9rem 2.7rem; border: 1px solid #d8dfd8; border-radius: 12px; background: #fff; }.form-input:focus { border-color: #2f7d4a; box-shadow: 0 0 0 4px rgba(47,125,74,.12); }.input-icon { left: 15px; filter: grayscale(1); opacity: .7; }
  .btn-login { padding: 1rem; margin-top: 4px; border-radius: 12px; background: #2f7d4a; box-shadow: 0 12px 24px rgba(47,125,74,.22); }.btn-login:hover { background: #173f35; box-shadow: 0 15px 28px rgba(23,63,53,.25); }.divider { margin: 25px 0 20px; }.register-row { color: #69766e; }.register-row a, .back-home a { color: #2f7d4a; }.back-home { margin-top: 18px; }.trust-badges { justify-content: flex-start; gap: 18px; margin-top: 28px; }.trust-badge { color: #7b887f; font-size: .7rem; }
  .login-card::before { content: 'AGROGUIDE AI  /  PLANT CARE'; display: block; color: #2f7d4a; font-size: .68rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 18px; }
  @media (max-width: 768px) { .login-right { padding: 40px 24px; }.login-card { max-width: 465px; }.login-card::before { margin-top: 4px; }.card-header h2 { font-size: 2.2rem; } }
`;

async function loginUser(email, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid email or password.');
  return data;
}

function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.'); return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">

        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="left-logo">
            <div className="left-logo-icon">AG</div>
            <span className="left-logo-text">Agro<span>Guide</span> AI</span>
          </div>
          <h2 className="left-heading">
            A healthier garden<br />starts with <span>one leaf.</span>
          </h2>
          <p className="left-desc">
            Sign in to identify vegetable disease symptoms, understand what your plant needs, and follow a clear care plan.
          </p>
          <div className="left-features">
            <div className="left-feature">
              <div className="lf-icon">01</div>
              <div className="lf-text">
                <h4>Share a clear leaf photo</h4>
                <p>Start with the plant you are worried about</p>
              </div>
            </div>
            <div className="left-feature">
              <div className="lf-icon">02</div>
              <div className="lf-text">
                <h4>Understand the symptoms</h4>
                <p>Get a focused result in moments</p>
              </div>
            </div>
            <div className="left-feature">
              <div className="lf-icon">03</div>
              <div className="lf-text">
                <h4>Follow a care plan</h4>
                <p>Simple steps for healthier plants</p>
              </div>
            </div>
          </div>
          <div className="left-stats">
            <div className="lst"><span className="lst-num">98%</span><span className="lst-label">Accuracy</span></div>
            <div className="lst"><span className="lst-num">50K+</span><span className="lst-label">Diagnosed</span></div>
            <div className="lst"><span className="lst-num">24/7</span><span className="lst-label">Available</span></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <h2>Welcome Back </h2>
              <p>Sign in to your <span>AgroGuide AI</span> account</p>
            </div>

            {error   && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">📧</span>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-login" disabled={loading}>
                {loading ? <span className="spinner"></span> : '🌿'}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="register-row">
              Don't have an account? <Link to="/register">Create one free</Link>
            </div>

            <div className="back-home">
              <Link to="/">← Back to Home</Link>
            </div>

            <div className="trust-badges">
              <span className="trust-badge">🔒 Secure Login</span>
              <span className="trust-badge">🌿 100% Free</span>
              <span className="trust-badge">⚡ Instant Access</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;