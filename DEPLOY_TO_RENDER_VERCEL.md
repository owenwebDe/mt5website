# 🚀 Deploy to Render & Vercel Guide

Complete guide to deploy your MT5 Trading Dashboard to production.

**GitHub Repository:** https://github.com/owenwebDe/mt5website.git

---

## 📋 Deployment Strategy

### Architecture:
```
Frontend (Vercel) ←→ Backend (Render) ←→ MT5 via Python
```

- **Frontend:** Vercel (Free tier, fast CDN)
- **Backend:** Render (Free tier, supports Node.js + Python)
- **Database:** MongoDB Atlas (Free tier, optional)

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
# Navigate to your project
cd "c:\Users\Admin\Documents\all my website\mt5 web\2nd try"

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render and Vercel deployment"

# Add remote (your repo)
git remote add origin https://github.com/owenwebDe/mt5website.git

# Push to GitHub
git push -u origin main
```

**Note:** If branch is `master` instead of `main`, use:
```bash
git push -u origin master
```

---

### Step 2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

---

### Step 3: Create New Web Service on Render

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Find: `owenwebDe/mt5website`
   - Click **"Connect"**

3. **Configure Service:**

   **Basic Settings:**
   ```
   Name: mt5-dashboard-backend
   Region: Oregon (US West)
   Branch: main (or master)
   Root Directory: (leave blank)
   ```

   **Build Settings:**
   ```
   Environment: Node
   Build Command: cd backend && npm install && cd python && pip install -r requirements.txt
   Start Command: cd backend && npm start
   ```

   **Plan:**
   ```
   Select: Free (0$/month)
   ```

4. **Add Environment Variables:**

   Click **"Advanced" → "Add Environment Variable"**

   Add these one by one:

   ```
   NODE_ENV = production
   PORT = 10000
   PYTHON_PORT = 5001
   PYTHON_BRIDGE_URL = http://localhost:5001
   ENABLE_PYTHON_BRIDGE = true
   FRONTEND_URL = (leave empty for now, will update after Vercel)
   MONGODB_URI = (leave empty or use MongoDB Atlas)
   ```

5. **Click "Create Web Service"**

6. **Wait for Deployment** (5-10 minutes)
   - Render will build and deploy your backend
   - Watch the logs for any errors

7. **Copy Your Backend URL**
   - Once deployed, you'll get a URL like:
   - `https://mt5-dashboard-backend.onrender.com`
   - **Save this URL!** You'll need it for Vercel

---

## 🎯 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Authorize Vercel

---

### Step 2: Import Project

1. Click **"Add New..." → "Project"**

2. **Import Git Repository:**
   - Find: `owenwebDe/mt5website`
   - Click **"Import"**

3. **Configure Project:**

   **Framework Preset:**
   ```
   Vite
   ```

   **Root Directory:**
   ```
   frontend
   ```

   **Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables:**

   Click **"Environment Variables"**

   Add these:

   ```
   VITE_API_URL = https://mt5-dashboard-backend.onrender.com/api
   VITE_BACKEND_URL = https://mt5-dashboard-backend.onrender.com
   ```

   **Replace with your actual Render backend URL from Part 1!**

5. **Click "Deploy"**

6. **Wait for Deployment** (2-3 minutes)

7. **Get Your Frontend URL:**
   - You'll get a URL like:
   - `https://mt5website.vercel.app`
   - Or custom domain if configured

---

## 🎯 Part 3: Update Backend CORS

### Step 1: Update Render Environment Variables

1. Go back to Render dashboard
2. Open your **mt5-dashboard-backend** service
3. Go to **"Environment"**
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://mt5website.vercel.app
   ```
   (Use your actual Vercel URL)

5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## 🎯 Part 4: Optional - MongoDB Atlas

If you want database logging:

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a **Free Cluster**

### Step 2: Create Database User

1. **Database Access** → **Add New Database User**
2. Choose username and password
3. Save credentials

### Step 3: Whitelist IP Addresses

1. **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Confirm

### Step 4: Get Connection String

1. Go to **Clusters** → **Connect**
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mt5_trading
   ```

### Step 5: Add to Render

1. In Render dashboard
2. Environment variables
3. Update `MONGODB_URI`:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/mt5_trading
   ```
4. Save and redeploy

---

## ✅ Verification Checklist

### Test Your Deployment:

**Backend Health Check:**
```
https://your-backend.onrender.com/health
```
Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "mongodb": "connected" or "disconnected"
}
```

**Frontend:**
```
https://your-app.vercel.app
```
Should show the login page

**Test Login:**
1. Open frontend URL
2. Enter MT5 credentials
3. Click "Connect to MT5"
4. Should connect (if you have valid MT5 broker account)

---

## 🔧 Troubleshooting

### Issue: Backend Won't Start

**Check Render Logs:**
1. Go to Render dashboard
2. Click your service
3. View **"Logs"** tab
4. Look for errors

**Common fixes:**
- Verify build command is correct
- Check all environment variables are set
- Ensure Python packages install successfully

---

### Issue: Frontend Can't Connect to Backend

**Fix:**
1. Check CORS settings
2. Verify `FRONTEND_URL` in Render matches Vercel URL exactly
3. Check `VITE_BACKEND_URL` in Vercel is correct
4. Redeploy both services

---

### Issue: WebSocket Connection Failed

**Fix:**
1. Render free tier may take 1-2 minutes to wake up
2. WebSocket should work, but may have cold start delay
3. Check browser console for errors

---

### Issue: Python Packages Won't Install

**Fix:**
1. Check `requirements.txt` is in `backend/python/`
2. Verify build command includes pip install
3. May need to add `python` directory to build

---

## 🎨 Custom Domain (Optional)

### For Vercel:

1. Go to project settings
2. **Domains** → **Add**
3. Enter your domain
4. Follow DNS configuration instructions

### For Render:

1. Go to service settings
2. **Custom Domains** → **Add**
3. Enter your domain
4. Update DNS records

---

## 📊 Monitoring

### Render:

- **Dashboard** shows service status
- **Logs** for real-time debugging
- **Metrics** for usage stats

### Vercel:

- **Analytics** for traffic
- **Logs** for deployment history
- **Speed Insights** for performance

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Render Free:**
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity
- ✅ Wakes on request (~30s)
- ❌ Custom domains require paid plan

**Vercel Free:**
- ✅ Unlimited bandwidth
- ✅ 100 GB/month
- ✅ Automatic HTTPS
- ✅ Custom domains included

**MongoDB Atlas Free:**
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Enough for this project

**Total Cost: $0/month** 🎉

---

## 🔄 Updating Your App

### Push Changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

**Auto-deploy:**
- Vercel: Deploys automatically on push
- Render: Deploys automatically on push

---

## 🚀 Production Checklist

Before going live:

- [ ] Backend deployed to Render ✅
- [ ] Frontend deployed to Vercel ✅
- [ ] Environment variables configured ✅
- [ ] CORS updated with Vercel URL ✅
- [ ] Health check endpoint working ✅
- [ ] Frontend loads without errors ✅
- [ ] Can connect to MT5 (with valid broker account) ✅
- [ ] WebSocket connections working ✅
- [ ] Mobile responsive verified ✅
- [ ] SSL/HTTPS enabled (automatic) ✅

---

## 📧 URLs to Share with Your Boss

After deployment, share these:

```
Frontend (User Interface):
https://mt5website.vercel.app

Backend API:
https://mt5-dashboard-backend.onrender.com

Health Check:
https://mt5-dashboard-backend.onrender.com/health

GitHub Repository:
https://github.com/owenwebDe/mt5website
```

---

## 🎉 Success!

Your MT5 Trading Dashboard is now live and accessible worldwide!

**Next Steps:**
1. Test with your MT5 account
2. Share with your boss
3. Get feedback
4. Iterate and improve

---

## 📞 Support

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Vercel Support:**
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

---

**Deployment Complete! 🚀**

*Your professional trading dashboard is now production-ready!*
