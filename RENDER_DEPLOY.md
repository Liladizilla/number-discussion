# Deploy to Render - Step-by-Step Guide

## Prerequisites
- GitHub account with repo pushed: https://github.com/Liladizilla/number-discussion
- Render account (https://render.com)

---

## Step 1: Create PostgreSQL Database

1. Go to **Render Dashboard** → **New +** → **PostgreSQL**
2. Fill in:
   - **Name**: `number-discussion-db`
   - **Database**: `numberdiscussion`
   - **User**: `postgres` (default)
   - **Region**: Choose closest to you (e.g., `Oregon`)
   - **Plan**: Free (included)
3. Click **Create Database**
4. Wait for it to provision (~2 min). Then copy the full connection string:
   - Look for **Internal Database URL** (for backend to use)
   - Example: `postgresql://postgres:YOUR_PASSWORD@dpg-xyz123.oregon-postgres.render.com/numberdiscussion`
   - **Save this for Step 2**

---

## Step 2: Deploy Backend

1. Go to **Render Dashboard** → **New +** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. Connect GitHub (authorize if needed)
4. Select repo: `Liladizilla/number-discussion`
5. Fill in:
   - **Name**: `number-discussion-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Plan**: Free
6. Click **Advanced** and add **Environment Variables**:
   ```
   DATABASE_URL = <paste the full URL from Step 1>
   JWT_SECRET = <generate strong secret, e.g.: mynumberdiscussionsecret123!@#xyz>
   ```
7. Click **Create Web Service**
8. Wait for deploy (~5 min). Once live, copy the **URL** (e.g., `https://number-discussion-backend-xxxx.onrender.com`)
   - **Save this for Step 3**

---

## Step 3: Deploy Frontend

1. Go to **Render Dashboard** → **New +** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. Select repo: `Liladizilla/number-discussion` (again)
4. Fill in:
   - **Name**: `number-discussion-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or use the nginx container from Dockerfile)
   - **Plan**: Free
5. Click **Advanced** and add **Build Environment Variables**:
   ```
   VITE_API_URL = https://number-discussion-backend-xxxx.onrender.com
   ```
   *(Replace with your actual backend URL from Step 2)*
6. Click **Create Web Service**
7. Wait for deploy (~5 min). Once live, you'll get a frontend URL (e.g., `https://number-discussion-frontend-yyyy.onrender.com`)

---

## Step 4: Test the App

1. Visit your frontend URL: `https://number-discussion-frontend-yyyy.onrender.com`
2. Register a new account:
   - Username: `testuser`
   - Password: `testpass123`
3. Create a starting number: `10`
4. Add operations: `+ 5`, `* 2`, etc.
5. Verify the calculation tree displays correctly

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct (internal URL for postgres)
- Ensure `JWT_SECRET` is set

### Frontend can't reach backend
- Check browser console (F12) for CORS/network errors
- Verify `VITE_API_URL` is set in build vars and matches your backend URL
- Ensure backend is running and accessible

### Database issues
- Check Render PostgreSQL logs
- Verify tables were created: backend runs `initDB()` on startup
- If tables missing, restart backend service to re-run init

---

## Summary of URLs/Secrets to Track

| Service | Type | URL/Value |
|---------|------|-----------|
| **Database** | PostgreSQL | `postgresql://...` (internal) |
| **Backend** | Web Service | `https://number-discussion-backend-*.onrender.com` |
| **Frontend** | Web Service | `https://number-discussion-frontend-*.onrender.com` |
| **JWT_SECRET** | Env Var | (your random secret) |

---

## Optional: Custom Domain

After all services are live, you can add a custom domain via Render Settings → Custom Domains.

---

## Notes

- **Free tier**: Services spin down after 15 min of inactivity (cold start ~30 sec).
- **Database**: Included free tier has limits. For production, upgrade plan.
- **Environment Variables**: Keep `JWT_SECRET` private; never commit to repo.
