# 🚀 Quick Deployment Reference Card

**30-Second Overview** - Deploy your MT5 Dashboard to Render & Vercel

---

## 📦 What You Have

✅ Complete MT5 Trading Dashboard
✅ GitHub Repo: https://github.com/owenwebDe/mt5website.git
✅ Ready for deployment

---

## ⚡ 5-Step Deployment

### 1️⃣ Push to GitHub (2 min)
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2️⃣ Deploy Backend - Render (10 min)
- https://render.com → Sign up with GitHub
- New Web Service → Select: `owenwebDe/mt5website`
- Build: `cd backend && npm install && cd python && pip install -r requirements.txt`
- Start: `cd backend && npm start`
- Add env vars (see below)
- Deploy!

### 3️⃣ Deploy Frontend - Vercel (3 min)
- https://vercel.com → Sign up with GitHub
- Import Project → Select: `owenwebDe/mt5website`
- Root: `frontend`
- Add env vars (see below)
- Deploy!

### 4️⃣ Update CORS (2 min)
- Render → Environment → Add Vercel URL
- Save & redeploy

### 5️⃣ Test (2 min)
- Open Vercel URL
- Test login page
- Done! 🎉

**Total Time: ~20 minutes**

---

## 🔑 Environment Variables

### Render (Backend):
```
NODE_ENV=production
PORT=10000
PYTHON_PORT=5001
PYTHON_BRIDGE_URL=http://localhost:5001
ENABLE_PYTHON_BRIDGE=true
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend):
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] CORS updated on Render
- [ ] Health check works
- [ ] Frontend loads
- [ ] Done! 🚀

---

## 🌐 Your URLs

After deployment:

```
Frontend: https://mt5website.vercel.app
Backend:  https://[your-name]-backend.onrender.com
Health:   https://[your-name]-backend.onrender.com/health
GitHub:   https://github.com/owenwebDe/mt5website
```

---

## 📚 Full Guides

Need more details?

- **Step-by-step:** [DEPLOY_TO_RENDER_VERCEL.md](DEPLOY_TO_RENDER_VERCEL.md)
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Ready status:** [READY_FOR_DEPLOYMENT.md](READY_FOR_DEPLOYMENT.md)

---

## ✅ Success Test

Your deployment worked if:

✅ `https://your-backend.onrender.com/health` returns JSON
✅ `https://your-app.vercel.app` shows login page
✅ No CORS errors in browser console
✅ WebSocket connects

---

**That's it! Simple and fast!** 🚀

*Total cost: $0/month on free tiers*
