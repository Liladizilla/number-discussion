# Render Configuration - Set These Now

Your services are deployed but need configuration to work together.

## Backend Service: `number-discussion-2.onrender.com`

✅ Already deployed

**Verify these environment variables are set:**
1. Go to Render Dashboard → `number-discussion-backend` service
2. Click **Environment**
3. Confirm these vars exist:
   - `DATABASE_URL`: `postgresql://number_discussion_db_user:NuAOsmuk6DgAlELrI3jqZbaZzRstjRfq@dpg-d4jvj4ggjchc739r0en0-a/number_discussion_db`
   - `JWT_SECRET`: (whatever you set, e.g., "your-secret-key-123")
4. If missing, add them and click **Save**
5. Service will auto-restart

---

## Frontend Service: `number-discussion-3.onrender.com`

✅ Deployed but needs backend URL configured

**Update build environment variable:**
1. Go to Render Dashboard → `number-discussion-frontend` service
2. Click **Environment** (or **Build Settings**)
3. Find or add this variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://number-discussion-2.onrender.com`
4. Click **Save**
5. Click **Manual Deploy** → **Deploy latest commit** to rebuild with the new env var
6. Wait for build to complete (~3-5 min)

---

## PostgreSQL Database

✅ Provisioned at: `dpg-d4jvj4ggjchc739r0en0-a`

**Verify connection:**
- Backend will auto-create tables on first startup
- Check Render Dashboard → PostgreSQL service logs if issues

---

## After Configuration: Test Flow

1. Visit: `https://number-discussion-3.onrender.com`
2. Open browser DevTools (F12) → **Console**
3. Should see: `Connecting to API at: https://number-discussion-2.onrender.com`
4. Try to **Register**:
   - Username: `testuser`
   - Password: `testpass123`
5. Should see success, then redirected to login
6. **Login** with same credentials
7. Create starting number: `10`
8. Add operations: `+ 5`, `* 2`, etc.
9. See calculation tree update in real-time

---

## If Something Fails

### "Cannot reach backend" / CORS errors
- Verify `VITE_API_URL` is set correctly in frontend build settings
- Check frontend service logs for the actual URL being used
- Verify backend service is running (check its logs)

### "Database connection failed"
- Verify backend has correct `DATABASE_URL` env var
- Check backend logs for connection errors
- Render PostgreSQL might be cold-starting; try restarting backend service

### Tables missing
- Backend auto-creates tables via `initDB()` on startup
- Check backend logs to see if schema creation succeeded
- Manually restart backend service to re-run `initDB()`

---

## Summary

| Service | URL | Status |
|---------|-----|--------|
| **Database** | `postgresql://...` | ✅ Provisioned |
| **Backend** | https://number-discussion-2.onrender.com | ✅ Deployed |
| **Frontend** | https://number-discussion-3.onrender.com | ⏳ Waiting for `VITE_API_URL` env var |

**Next step:** Set `VITE_API_URL=https://number-discussion-2.onrender.com` in frontend build environment and trigger rebuild.
