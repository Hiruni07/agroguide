import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

  :root {
    --green: #168b43;
    --green-dark: #075c2c;
    --green-light: #a8f3b5;
    --dark: #102419;
    --muted: #7b887f;
    --border: #e1ebe3;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'DM Sans', sans-serif;
    background: #f5f9f5;
  }

  .register-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 44% 56%;
    overflow: hidden;
  }

  .register-hero {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 42px 9%;
    overflow: hidden;
    color: #fff;
    background:
      linear-gradient(145deg, rgba(5, 58, 32, .96), rgba(20, 133, 67, .9)),
      url('https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1400&q=85')
      center / cover;
  }

  .register-hero::before,
  .register-hero::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .register-hero::before {
    width: 460px;
    height: 460px;
    top: 80px;
    right: -220px;
    background: rgba(164, 245, 176, .12);
  }

  .register-hero::after {
    width: 520px;
    height: 520px;
    bottom: -300px;
    left: -230px;
    border: 1px solid rgba(255,255,255,.16);
  }

  .brand {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 11px;
    width: fit-content;
    color: #fff;
    text-decoration: none;
  }

  .brand-icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 15px;
    background: rgba(255,255,255,.14);
    font-size: 24px;
  }

  .brand-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -.8px;
  }

  .brand-name span {
    color: var(--green-light);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 500px;
  }

  .hero-main {
    margin: auto 0;
    padding: 80px 0 40px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 20px;
    padding: 8px 14px;
    border: 1px solid rgba(168,247,181,.3);
    border-radius: 50px;
    color: #c9ffd1;
    background: rgba(133,244,158,.12);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .5px;
  }

  .eyebrow::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green-light);
    box-shadow: 0 0 0 5px rgba(168,243,181,.15);
  }

  .hero-title {
    margin: 0 0 20px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2.5rem, 4vw, 4.2rem);
    line-height: 1.06;
    letter-spacing: -2.5px;
  }

  .hero-title span {
    color: var(--green-light);
  }

  .hero-description {
    max-width: 430px;
    margin: 0;
    color: rgba(255,255,255,.76);
    font-size: 16px;
    line-height: 1.75;
  }

  .benefits {
    display: grid;
    gap: 14px;
    margin-top: 38px;
  }

  .benefit {
    display: flex;
    align-items: center;
    gap: 13px;
    color: rgba(255,255,255,.88);
    font-size: 14px;
  }

  .benefit-icon {
    display: grid;
    place-items: center;
    width: 31px;
    height: 31px;
    border-radius: 10px;
    color: #c5ffd0;
    background: rgba(170,255,185,.15);
  }

  .hero-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 8px;
    color: rgba(255,255,255,.68);
    font-size: 12px;
  }

  .avatars {
    display: flex;
  }

  .avatar {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    margin-left: -7px;
    border: 2px solid #19663b;
    border-radius: 50%;
    color: #166534;
    background: #dcfce7;
    font-size: 10px;
    font-weight: 700;
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .register-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 7%;
    overflow-y: auto;
    background: #f8fbf8;
  }

  .form-wrapper {
    width: 100%;
    max-width: 510px;
  }

  .mobile-brand {
    display: none;
  }

  .form-header {
    margin-bottom: 25px;
  }

  .form-header h1 {
    margin: 0 0 8px;
    color: var(--dark);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 30px;
    letter-spacing: -1.3px;
  }

  .form-header p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
  }

  .form-header a,
  .terms a {
    color: var(--green);
    font-weight: 700;
    text-decoration: none;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #849188;
    font-size: 11px;
    font-weight: 600;
  }

  .progress-track {
    height: 6px;
    margin-bottom: 24px;
    overflow: hidden;
    border-radius: 20px;
    background: #e5eee6;
  }

  .progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #1a9849, #8ce58e);
    transition: width .3s ease;
  }

  .form-card {
    padding: 30px;
    border: 1px solid var(--border);
    border-radius: 24px;
    background: rgba(255,255,255,.95);
    box-shadow: 0 18px 55px rgba(34,80,47,.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form-group {
    margin-bottom: 17px;
  }

  .form-label {
    display: block;
    margin-bottom: 7px;
    color: #344139;
    font-size: 12px;
    font-weight: 700;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    top: 50%;
    left: 14px;
    z-index: 1;
    color: #95a399;
    font-size: 15px;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .form-input,
  .form-select {
    width: 100%;
    height: 48px;
    padding: 0 42px;
    outline: none;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    color: #17251c;
    background: #f9fcf9;
    font: inherit;
    font-size: 13px;
    transition: .2s ease;
  }

  .form-select {
    padding-right: 14px;
    cursor: pointer;
  }

  .form-input::placeholder {
    color: #b2beb5;
  }

  .form-input:focus,
  .form-select:focus {
    border-color: #32ad58;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(50,173,88,.1);
  }

  .password-button {
    position: absolute;
    top: 50%;
    right: 13px;
    display: grid;
    place-items: center;
    width: 25px;
    height: 25px;
    padding: 0;
    border: 0;
    color: #7d8d82;
    background: transparent;
    cursor: pointer;
    transform: translateY(-50%);
  }

  .password-button:hover {
    color: var(--green);
  }

  .strength {
    margin-top: 8px;
  }

  .strength-bars {
    display: flex;
    gap: 4px;
    margin-bottom: 5px;
  }

  .strength-bar {
    height: 4px;
    flex: 1;
    border-radius: 5px;
    background: #e6eee7;
  }

  .strength-bar.active.weak {
    background: #ef6b67;
  }

  .strength-bar.active.medium {
    background: #edb34c;
  }

  .strength-bar.active.strong {
    background: #27a653;
  }

  .strength-text {
    color: #87948b;
    font-size: 11px;
  }

  .strength-text.weak {
    color: #dc514d;
  }

  .strength-text.medium {
    color: #c88619;
  }

  .strength-text.strong {
    color: #168840;
  }

  .terms {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin: 5px 0 21px;
    color: #76837a;
    font-size: 12px;
    line-height: 1.55;
  }

  .terms input {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    flex-shrink: 0;
    accent-color: #199b47;
    cursor: pointer;
  }

  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    gap: 9px;
    border: 0;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(110deg, #168d42, #25b151);
    box-shadow: 0 8px 18px rgba(25,151,69,.23);
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s ease;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 11px 23px rgba(25,151,69,.3);
  }

  .submit-button:disabled {
    cursor: not-allowed;
    opacity: .65;
  }

  .message {
    margin-bottom: 17px;
    padding: 12px 14px;
    border-radius: 11px;
    font-size: 12px;
    line-height: 1.5;
  }

  .error-message {
    border: 1px solid #fecaca;
    color: #c93434;
    background: #fff3f3;
  }

  .success-message {
    border: 1px solid #b9ebc6;
    color: #168840;
    background: #effcf2;
  }

  .form-footer {
    margin-top: 22px;
    color: #87938a;
    font-size: 12px;
    text-align: center;
  }

  .home-link {
    display: block;
    margin-top: 14px;
    color: #87938a;
    font-size: 12px;
    text-align: center;
    text-decoration: none;
  }

  .home-link:hover {
    color: var(--green);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    .register-page {
      grid-template-columns: 1fr;
    }

    .register-hero {
      display: none;
    }

    .register-content {
      min-height: 100vh;
      padding: 28px 20px;
    }

    .mobile-brand {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 28px;
      color: var(--dark);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 800;
      text-decoration: none;
    }

    .mobile-brand span {
      color: var(--green);
    }
  }

  @media (max-width: 560px) {
    .form-card {
      padding: 22px 18px;
      border-radius: 18px;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .form-header h1 {
      font-size: 26px;
    }
  }
`;

function getPasswordStrength(password) {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return 1;
  if (score <= 3) return 2;
  return 3;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label} *
      </label>

      <div className="input-wrapper">
        <span className="input-icon">🔒</span>

        <input
          id={id}
          className="form-input"
          name={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength="6"
          required
        />

        <button
          className="password-button"
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'farmer',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);
  const strengthClass = ['', 'weak', 'medium', 'strong'][strength];
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength];

  const completedFields = [
    form.firstName,
    form.lastName,
    form.email,
    form.role,
    form.password,
    form.confirmPassword,
    agreed,
  ].filter(Boolean).length;

  const progress = Math.round((completedFields / 7) * 100);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.role ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError('Please complete all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          role: form.role,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.name === 'TypeError') {
        setError(
          'Unable to connect to the server. Please make sure the backend is running.'
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <main className="register-page">
        <section className="register-hero">
          <Link className="brand" to="/">
            <span className="brand-icon">🌿</span>
            <span className="brand-name">
              Agro<span>Guide</span> AI
            </span>
          </Link>

          <div className="hero-content">
            <div className="hero-main">
              <div className="eyebrow">SMARTER FARMING STARTS HERE</div>

              <h1 className="hero-title">
                Grow better.
                <br />
                <span>Farm smarter.</span>
              </h1>

              <p className="hero-description">
                Join thousands of farmers using AgroGuide AI for smarter plant
                diagnosis and personalized crop care.
              </p>

              <div className="benefits">
                <div className="benefit">
                  <span className="benefit-icon">✓</span>
                  Instant AI plant diagnosis
                </div>

                <div className="benefit">
                  <span className="benefit-icon">✓</span>
                  Personalized treatment guidance
                </div>

                <div className="benefit">
                  <span className="benefit-icon">✓</span>
                  Free to get started
                </div>
              </div>
            </div>

            <div className="hero-footer">
              <div className="avatars">
                <span className="avatar">AK</span>
                <span className="avatar">RM</span>
                <span className="avatar">PS</span>
              </div>

              Trusted by 50,000+ growers worldwide
            </div>
          </div>
        </section>

        <section className="register-content">
          <div className="form-wrapper">
            <Link className="mobile-brand" to="/">
              🌿 Agro<span>Guide</span> AI
            </Link>

            <header className="form-header">
              <h1>Create your free account</h1>
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign in here</Link>
              </p>
            </header>

            <div className="progress-info">
              <span>Complete your profile</span>
              <span>{progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              {error && (
                <div className="message error-message">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="message success-message">
                  ✅ {success}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">
                    First name *
                  </label>

                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="firstName"
                      className="form-input"
                      name="firstName"
                      type="text"
                      placeholder="Hiruni"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">
                    Last name *
                  </label>

                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="lastName"
                      className="form-input"
                      name="lastName"
                      type="text"
                      placeholder="Silva"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email address *
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  I am a *
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">🌾</span>

                  <select
                    id="role"
                    className="form-select"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="farmer">Farmer</option>
                    <option value="gardener">Home Gardener</option>
                  </select>
                </div>
              </div>

              <PasswordField
                id="password"
                label="Password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                visible={showPassword}
                onToggle={() => setShowPassword((value) => !value)}
              />

              {form.password && (
                <div className="strength">
                  <div className="strength-bars">
                    {[1, 2, 3].map((bar) => (
                      <div
                        key={bar}
                        className={`strength-bar ${
                          strength >= bar
                            ? `active ${strengthClass}`
                            : ''
                        }`}
                      />
                    ))}
                  </div>

                  <span className={`strength-text ${strengthClass}`}>
                    Password strength: {strengthLabel}
                  </span>
                </div>
              )}

              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                visible={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword((value) => !value)
                }
              />

              <div className="terms">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />

                <label htmlFor="terms">
                  I agree to the <a href="#terms">Terms of Service</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>.
                </label>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating account...
                  </>
                ) : (
                  <>🌱 Create free account</>
                )}
              </button>
            </form>

            <div className="form-footer">
              🔒 Your data is secure and will never be shared.
            </div>

            <Link className="home-link" to="/">
              ← Back to home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Register;