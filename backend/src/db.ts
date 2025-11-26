// In-memory storage (for demo/development without external DB)
export interface User {
  id: number
  username: string
  password_hash: string
  created_at: Date
}

export interface Calculation {
  id: number
  user_id: number
  parent_id: number | null
  operation: string | null
  number: number
  result: number
  created_at: Date
}

let users: User[] = []
let calculations: Calculation[] = []
let nextUserId = 1
let nextCalcId = 1

export const initDB = async () => {
  console.log('In-memory database initialized')
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
  return users.find(u => u.username === username) || null
}

export const createUser = async (username: string, password_hash: string): Promise<User> => {
  const user: User = {
    id: nextUserId++,
    username,
    password_hash,
    created_at: new Date()
  }
  users.push(user)
  return user
}

export const getAllCalculations = async (): Promise<Calculation[]> => {
  return calculations.map(c => ({ ...c }))
}

export const getCalculationsByParent = async (parentId: number | null): Promise<Calculation[]> => {
  return calculations.filter(c => c.parent_id === parentId).map(c => ({ ...c }))
}

export const createCalculation = async (
  userId: number,
  parentId: number | null,
  number: number,
  operation: string | null = null
): Promise<Calculation> => {
  // For START operations, result = number. For operations, calculate from parent.
  let result = number
  if (operation && parentId !== null) {
    const parent = calculations.find(c => c.id === parentId)
    if (parent) {
      switch (operation) {
        case '+': result = parent.result + number; break
        case '-': result = parent.result - number; break
        case '*': result = parent.result * number; break
        case '/': result = parent.result / number; break
      }
    }
  }

  const calc: Calculation = {
    id: nextCalcId++,
    user_id: userId,
    parent_id: parentId,
    operation,
    number,
    result,
    created_at: new Date()
  }
  calculations.push(calc)
  return calc
}

export default {
  initDB,
  getUserByUsername,
  createUser,
  getAllCalculations,
  getCalculationsByParent,
  createCalculation
}