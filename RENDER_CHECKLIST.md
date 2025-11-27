# Render Deployment Checklist

## Phase 1: Database
- [ ] Visit https://render.com (login/signup)
- [ ] Dashboard → New → PostgreSQL
- [ ] Name: `number-discussion-db`
- [ ] Copy **Internal Database URL** → save to notepad

## Phase 2: Backend Service
- [ ] Dashboard → New → Web Service
- [ ] Connect GitHub → select `Liladizilla/number-discussion`
- [ ] **Name**: `number-discussion-backend`
- [ ] **Root Directory**: `backend`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `node dist/index.js`
- [ ] **Advanced** → **Environment Variables**:
  - `DATABASE_URL` = (paste from Phase 1)
  - `JWT_SECRET` = (any strong random string)
- [ ] Create → wait for deploy
- [ ] Copy backend URL → save to notepad

## Phase 3: Frontend Service
- [ ] Dashboard → New → Web Service
- [ ] Connect GitHub → select same repo
- [ ] **Name**: `number-discussion-frontend`
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Advanced** → **Build Environment Variables**:
  - `VITE_API_URL` = (paste backend URL from Phase 2)
- [ ] Create → wait for deploy
- [ ] Copy frontend URL

## Phase 4: Test
- [ ] Visit frontend URL in browser
- [ ] Register account
- [ ] Create starting number
- [ ] Add operations (+, -, *, /)
- [ ] Verify tree displays

## Saved Values

```
Database URL:
[                                                                    ]

Backend URL:
[                                                                    ]

Frontend URL:
[                                                                    ]

JWT_SECRET:
[                                                                    ]
```
