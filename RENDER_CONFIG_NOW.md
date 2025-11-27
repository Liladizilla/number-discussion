
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
