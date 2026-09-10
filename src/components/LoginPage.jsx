import { useState } from 'react'

/**
 * Login page for the admin back office.
 * Authenticates with Firebase Auth (email/password).
 */
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin(email, password)
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email')
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect')
      } else {
        setError('Erreur de connexion. Réessayez.')
      }
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h1>Back Office</h1>
        <p className="login-subtitle">Connectez-vous pour accéder à l'administration</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input login-input"
              placeholder="Email"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input login-input"
              placeholder="Mot de passe"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
