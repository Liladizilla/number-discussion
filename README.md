# Number Discussion

Minimal full-stack app for collaborative number computations.

Features
- Register / login (JWT)
- Start a calculation (starting number)
- Add operations (+, -, *, /) to any calculation
- Calculation tree view

Tech
- Node.js + TypeScript (backend)
- React + Vite + TypeScript (frontend)
- Dockerfiles + docker-compose.yml (optional)

Run locally

1. Frontend
```
cd frontend
npm install
npm start
```

2. Backend
```
cd backend
npm install
npm run dev
```

To create a GitHub repo and push:

1. Create repo on GitHub (via web UI or `gh` CLI).
2. Then run:
~~~
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
