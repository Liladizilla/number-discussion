import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDB, getUserByUsername, createUser, getAllCalculations, getCalculationsByParent, createCalculation } from './db';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register
app.post('/api/register', async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existing = await getUserByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);
    
    res.json({ user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all calculations (tree)
app.get('/api/calculations', async (req: any, res: any) => {
  try {
    const calcs = await getAllCalculations();
    res.json(calcs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
});

// Create starting number
app.post('/api/calculations', authenticateToken, async (req: any, res: any) => {
  try {
    const { number } = req.body;
    const userId = req.user.id;

    const calc = await createCalculation(userId, null, number, null);
    res.json(calc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create calculation' });
  }
});

// Add operation to existing calculation
app.post('/api/calculations/:parentId/operations', authenticateToken, async (req: any, res: any) => {
  try {
    const { parentId } = req.params;
    const { operation, number } = req.body;
    const userId = req.user.id;

    if (!operation || !['+',' -','*','/'].includes(operation)) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    if (operation === '/' && number === 0) {
      return res.status(400).json({ error: 'Division by zero' });
    }

    const calc = await createCalculation(userId, parseInt(parentId), number, operation);
    res.json(calc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add operation' });
  }
});

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);