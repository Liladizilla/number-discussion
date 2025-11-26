// Determine API URL at runtime
const getApiUrl = () => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const port = 3001
  return `http://${host}:${port}`
}

const API_URL = getApiUrl()

console.log('Connecting to API at:', API_URL)

export interface User {
  id: number
  username: string
}

export interface Calculation {
  id: number
  user_id: number
  parent_id: number | null
  operation: string | null
  number: number
  result: number
  created_at: string
}

export async function register(username: string, password: string): Promise<User> {
  try {
    const url = `${API_URL}/api/register`
    console.log('POST', url, { username, password })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    console.log('Response:', res.status, res.statusText)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    const data = await res.json()
    return data.user
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const url = `${API_URL}/api/login`
    console.log('POST', url, { username, password })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    console.log('Response:', res.status, res.statusText)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function getAllCalculations(): Promise<Calculation[]> {
  try {
    const url = `${API_URL}/api/calculations`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch calculations')
    return res.json()
  } catch (error) {
    console.error('Get calculations error:', error)
    throw error
  }
}

export async function createStartingNumber(token: string, number: number): Promise<Calculation> {
  try {
    const url = `${API_URL}/api/calculations`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error('Create starting number error:', error)
    throw error
  }
}

export async function addOperation(token: string, parentId: number, operation: string, number: number): Promise<Calculation> {
  try {
    const url = `${API_URL}/api/calculations/${parentId}/operations`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, number })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error('Add operation error:', error)
    throw error
  }
}

// Client-side utilities
export function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false
  if (n <= 3) return true
  if (n % 2 === 0) return false
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false
  }
  return true
}

export function analyzeNumber(n: number): string {
  const prime = isPrime(n)
  return `Prime: ${prime}`
}
