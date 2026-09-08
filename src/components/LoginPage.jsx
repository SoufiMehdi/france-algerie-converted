import { useState } from 'react'

/**
 * Login page for the admin back office.
 * Authenticates against a password stored in localStorage.
 */
export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const stored = localStorage.getItem('france-algerie-admin-password')
    const validPassword = stored || 'admin123'

    if (password === validPassword) {
      onLogin()
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h1>Back Office</h1>
        <p className="login-subtitle">Entrez le mot de passe pour accéder à l'administration</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input login-input"
              placeholder="Mot de passe"
              autoFocus
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary login-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
