# 🚀 Deployment Guide

Complete guide for deploying the MT5 Web Trading Dashboard to production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Heroku Deployment](#heroku-deployment)
3. [Render Deployment](#render-deployment)
4. [VPS Deployment](#vps-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ A working local installation
- ✅ Git repository set up
- ✅ MetaTrader 5 accessible (for production trading)
- ✅ MongoDB database (optional, can use MongoDB Atlas)
- ✅ Domain name (optional, for custom URL)

---

## 🟣 Heroku Deployment

### Step 1: Install Heroku CLI

```bash
# Windows
winget install Heroku.HerokuCLI

# Mac
brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

Verify installation:
```bash
heroku --version
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
# Create app
heroku create your-mt5-dashboard

# Or use this to auto-generate name
heroku create
```

### Step 4: Add Buildpacks

Heroku needs to know it should use both Node.js and Python:

```bash
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python
```

### Step 5: Configure Environment Variables

```bash
# Set Node environment
heroku config:set NODE_ENV=production

# Set Python bridge port
heroku config:set PYTHON_PORT=5001
heroku config:set PYTHON_BRIDGE_URL=http://localhost:5001

# Set frontend URL (replace with your Heroku app URL)
heroku config:set FRONTEND_URL=https://your-mt5-dashboard.herokuapp.com

# Optional: Set MongoDB URI (use MongoDB Atlas for cloud DB)
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mt5_trading

# Enable Python bridge
heroku config:set ENABLE_PYTHON_BRIDGE=true
```

### Step 6: Modify Package.json for Heroku

Create a new file `backend/package-heroku.json`:

```json
{
  "name": "mt5-web-dashboard-backend",
  "version": "1.0.0",
  "description": "Backend server for MT5 Web Trading Dashboard",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "cd ../frontend && npm install && npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.3",
    "axios": "^1.6.2",
    "body-parser": "^1.20.2"
  }
}
```

### Step 7: Update Server.js for Production

The server.js should serve the built frontend in production. Add this to your server.js:

```javascript
// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
```

### Step 8: Deploy to Heroku

```bash
# Add all files to git
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
git push heroku main

# Or if your branch is master:
git push heroku master
```

### Step 9: Open Your App

```bash
heroku open
```

### Heroku Logs

To view logs:
```bash
heroku logs --tail
```

---

## 🟢 Render Deployment

### Step 1: Create Render Account

Go to [https://render.com](https://render.com) and sign up.

### Step 2: Connect GitHub Repository

1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select your repository

### Step 3: Configure Web Service

**Basic Settings:**
- **Name**: mt5-dashboard
- **Environment**: Node
- **Region**: Choose closest to you
- **Branch**: main (or master)

**Build Settings:**
```bash
# Build Command
cd backend && npm install && cd ../frontend && npm install && npm run build

# Start Command
cd backend && npm start
```

**Environment Variables:**

Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
PYTHON_PORT=5001
PYTHON_BRIDGE_URL=http://localhost:5001
FRONTEND_URL=https://your-app.onrender.com
ENABLE_PYTHON_BRIDGE=true
MONGODB_URI=your_mongodb_uri_here
```

### Step 4: Advanced Settings

- **Auto-Deploy**: Yes
- **Health Check Path**: /health

### Step 5: Deploy

Click "Create Web Service" and Render will automatically deploy your app.

### Render Logs

View logs in the Render dashboard under "Logs" tab.

---

## 🖥️ VPS Deployment (Ubuntu)

### Step 1: Connect to Your VPS

```bash
ssh root@your-server-ip
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
node --version
npm --version
```

### Step 4: Install Python

```bash
apt install -y python3 python3-pip
python3 --version
```

### Step 5: Install MongoDB (Optional)

```bash
# Import MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
apt update
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod
```

### Step 6: Install Nginx

```bash
apt install -y nginx
```

### Step 7: Clone Your Repository

```bash
cd /var/www
git clone https://github.com/your-username/mt5-dashboard.git
cd mt5-dashboard
```

### Step 8: Install Dependencies

```bash
# Backend
cd backend
npm install

# Python
cd python
pip3 install -r requirements.txt

# Frontend
cd ../../frontend
npm install
npm run build
```

### Step 9: Configure Environment

```bash
cd /var/www/mt5-dashboard/backend
nano .env
```

Add your production environment variables.

### Step 10: Install PM2

```bash
npm install -g pm2
```

### Step 11: Create PM2 Ecosystem File

Create `ecosystem.config.js` in the root:

```javascript
module.exports = {
  apps: [
    {
      name: 'mt5-backend',
      cwd: '/var/www/mt5-dashboard/backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'mt5-python',
      cwd: '/var/www/mt5-dashboard/backend/python',
      script: 'mt5_bridge.py',
      interpreter: 'python3',
      args: '5001',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};
```

### Step 12: Start Applications

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 13: Configure Nginx

Create Nginx configuration:

```bash
nano /etc/nginx/sites-available/mt5-dashboard
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve frontend
    location / {
        root /var/www/mt5-dashboard/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/mt5-dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 14: Install SSL Certificate (Optional but Recommended)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend port | `3001` |
| `PYTHON_PORT` | Python bridge port | `5001` |
| `PYTHON_BRIDGE_URL` | Python bridge URL | `http://localhost:5001` |
| `FRONTEND_URL` | Frontend URL | `https://your-app.com` |
| `ENABLE_PYTHON_BRIDGE` | Enable Python bridge | `true` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mt5` |
| `MT5_LOGIN` | Default MT5 login | `12345678` |
| `MT5_PASSWORD` | Default MT5 password | `your_password` |
| `MT5_SERVER` | Default MT5 server | `MetaQuotes-Demo` |

---

## ✅ Post-Deployment

### 1. Test Your Deployment

```bash
# Check health endpoint
curl https://your-app.com/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "mongodb": "connected"
}
```

### 2. Monitor Logs

**Heroku:**
```bash
heroku logs --tail
```

**Render:**
View in dashboard under "Logs"

**VPS:**
```bash
pm2 logs
```

### 3. Set Up Monitoring

Consider using:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Performance**: New Relic, DataDog

### 4. Backup Strategy

- Regular MongoDB backups
- Git repository backups
- Environment variables backup (secure location)

### 5. Update Process

**Heroku/Render:**
```bash
git push origin main
# Auto-deploys if configured
```

**VPS:**
```bash
cd /var/www/mt5-dashboard
git pull
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart all
```

---

## 🆘 Troubleshooting Deployment

### Issue: App crashes on startup

**Check logs and ensure:**
- All environment variables are set
- Dependencies are installed
- Port is not in use
- MongoDB is accessible (if used)

### Issue: WebSocket not connecting

**Solutions:**
- Ensure WebSocket proxy is configured in Nginx
- Check CORS settings
- Verify frontend URL in backend config

### Issue: Python bridge not working

**Solutions:**
- Check if Python is installed in deployment environment
- Verify Python dependencies are installed
- Check if MetaTrader5 library is compatible with server OS
  - **Note**: MT5 Python library requires Windows or Wine on Linux

### Issue: 502 Bad Gateway

**Solutions:**
- Check if backend is running: `pm2 status`
- Verify port numbers in Nginx config
- Check backend logs: `pm2 logs mt5-backend`

---

## 📚 Additional Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Render Documentation](https://render.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Good luck with your deployment! 🚀**
