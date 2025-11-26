import React, { useState, useEffect } from 'react'
import {
  register,
  login,
  getAllCalculations,
  createStartingNumber,
  addOperation,
  User,
  Calculation,
} from './api'
import './styles.css'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auth UI state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Calculation UI state
  const [startNumber, setStartNumber] = useState('')
  const [selectedParent, setSelectedParent] = useState<number | null>(null)
  const [operation, setOperation] = useState('+')
  const [operand, setOperand] = useState('')

  // Fetch calculations
  const fetchCalculations = async () => {
    try {
      const calcs = await getAllCalculations()
      setCalculations(calcs)
      setError('')
    } catch (err) {
      setError(`Failed to load calculations: ${err}`)
    }
  }

  useEffect(() => {
    fetchCalculations()
  }, [])

  // Auth handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (authMode === 'register') {
        await register(username, password)
        setError('')
        setAuthMode('login')
        setPassword('')
      } else {
        const { token: newToken, user: newUser } = await login(username, password)
        setToken(newToken)
        setUser(newUser)
        setUsername('')
        setPassword('')
        setError('')
      }
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setStartNumber('')
    setSelectedParent(null)
    setOperation('+')
    setOperand('')
  }

  // Calculation handlers
  const handleCreateStarting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !user) return
    setLoading(true)
    try {
      const num = parseFloat(startNumber)
      if (!Number.isFinite(num)) throw new Error('Invalid number')
      await createStartingNumber(token, num)
      setStartNumber('')
      await fetchCalculations()
      setError('')
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddOperation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !user || selectedParent === null) return
    setLoading(true)
    try {
      const num = parseFloat(operand)
      if (!Number.isFinite(num)) throw new Error('Invalid operand')
      await addOperation(token, selectedParent, operation, num)
      setOperand('')
      setSelectedParent(null)
      setOperation('+')
      await fetchCalculations()
      setError('')
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  // Render tree
  const CalcTree: React.FC<{ parentId: number | null; depth: number }> = ({ parentId, depth }) => {
    const children = calculations.filter(c => c.parent_id === parentId)
    if (children.length === 0) return null

    return (
      <ul className="calc-tree-list" data-depth={depth}>
        {children.map(calc => {
          const isSelectable = user !== null
          return (
            <li key={calc.id} className={isSelectable ? 'calc-item clickable' : 'calc-item'}>
              <button
                onClick={() => isSelectable && setSelectedParent(calc.id)}
                className={selectedParent === calc.id ? 'selected' : ''}
              >
                <strong>{calc.operation || 'START'}</strong> {calc.number} = {calc.result}
                {calc.user_id && ` (by user ${calc.user_id})`}
              </button>
              <CalcTree parentId={calc.id} depth={depth + 1} />
            </li>
          )
        })}
      </ul>
    )
  }

  if (!user) {
    return (
      <div className="app">
        <h1>Number Discussion</h1>
        <p>A collaborative number calculation tree.</p>

        <div className="auth-form">
          <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleAuthSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login')
              setError('')
            }}
            className="button-secondary"
          >
            {authMode === 'login' ? 'Need account? Register' : 'Have account? Login'}
          </button>
        </div>

        <div className="calc-tree">
          <h3>Calculation Tree (view only)</h3>
          <CalcTree parentId={null} depth={0} />
          {calculations.length === 0 && <p>No calculations yet. Register and start one!</p>}
        </div>

        {error && <div className="error">{error}</div>}
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Number Discussion</h1>
      <p>Logged in as: <strong>{user.username}</strong></p>
      <button onClick={handleLogout} className="margin-bottom">
        Logout
      </button>

      {error && <div className="error">{error}</div>}

      <div className="form-section">
        <h3>Start a New Calculation</h3>
        <form onSubmit={handleCreateStarting}>
          <input
            type="number"
            placeholder="Starting number"
            value={startNumber}
            onChange={e => setStartNumber(e.target.value)}
            required
            step="any"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      {selectedParent !== null && (
        <div className="form-section">
          <h3>Add Operation</h3>
          <p>Selected: Calc #{selectedParent}</p>
          <form onSubmit={handleAddOperation}>
            <select value={operation} onChange={e => setOperation(e.target.value)} title="Operation">
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/">/</option>
            </select>
            <input
              type="number"
              placeholder="Right operand"
              value={operand}
              onChange={e => setOperand(e.target.value)}
              required
              step="any"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Operation'}
            </button>
            <button type="button" onClick={() => setSelectedParent(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="calc-tree">
        <h3>Calculation Tree (click to select)</h3>
        <ul className="calc-tree-list">
          {calculations.filter(c => c.parent_id === null).map(calc => {
            const isSelectable = user !== null
            return (
              <li key={calc.id} className={isSelectable ? 'calc-item clickable' : 'calc-item'}>
                <button
                  onClick={() => isSelectable && setSelectedParent(calc.id)}
                  className={selectedParent === calc.id ? 'selected' : ''}
                >
                  <strong>{calc.operation || 'START'}</strong> {calc.number} = {calc.result}
                  {calc.user_id && ` (by user ${calc.user_id})`}
                </button>
                <CalcTree parentId={calc.id} depth={1} />
              </li>
            )
          })}
        </ul>
        {calculations.length === 0 && <p>No calculations yet.</p>}
      </div>
    </div>
  )
}
