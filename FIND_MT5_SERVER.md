# 🔍 How to Find Your MT5 Server Name

## Quick Guide to Locate Your MT5 Server

Your login credentials:
- **Login:** mikkyicon
- **Password:** (you have it)
- **Server:** ❓ (we need to find this)

---

## 📧 Method 1: Check Your Registration Email

The broker should have sent you an email with:
- Account login (mikkyicon)
- Password
- **Server name** (this is what we need!)

**Look for:**
- Server name format: `BrokerName-Server` or `BrokerName-Demo` or `BrokerName-Live`
- Examples: "XMGlobal-Demo", "Exness-Demo", "ICMarkets-Demo 02"

---

## 💻 Method 2: Open MetaTrader 5 Terminal

### Step 1: Download & Install MT5
1. Go to https://www.metatrader5.com/en/download
2. Download for Windows
3. Install MetaTrader 5

### Step 2: Open MT5 and Find Server
1. **Open MetaTrader 5** application
2. Go to **File → Login to Trade Account**
3. You'll see a window with three fields:
   - Login
   - Password
   - Server

### Step 3: Find Your Server in the List
1. Click the **Server** dropdown
2. Start typing your broker's name
3. Look for servers matching your broker

**Common server name patterns:**
```
[BrokerName]-Demo
[BrokerName]-Live
[BrokerName]-Real
[BrokerName]-Server01
[BrokerName]-MT5
```

---

## 🌐 Method 3: Check the Broker's Website

Where did you register your MT5 account?
1. Go back to that broker's website
2. Look for:
   - "Trading Servers"
   - "Server Settings"
   - "MT5 Server List"
   - "Help" or "Support" section

Common brokers and their servers:
- **XM**: XMGlobal-Demo, XMGlobal-Real
- **Exness**: Exness-Demo, Exness-Real
- **IC Markets**: ICMarkets-Demo, ICMarkets-Live
- **Pepperstone**: Pepperstone-Demo, Pepperstone-Live
- **FXTM**: FXTM-Demo, FXTM-Real

---

## 📱 Method 4: Contact Broker Support

If you still can't find it:
1. Contact your broker's support
2. Provide your login: **mikkyicon**
3. Ask: "What is my MT5 server name?"

They usually respond within minutes via:
- Live chat
- Email
- Phone support

---

## 🎯 Once You Find Your Server

### Update Your Dashboard:

1. Open your browser to: http://localhost:5173
2. Enter your credentials:
   - **Account Number:** mikkyicon
   - **Password:** (your password)
   - **Server:** (the server name you found)
3. Click "Connect to MT5"

---

## ⚠️ Important Note About Python Packages

Before you can actually connect, you need to install Python packages first:

### Fix Steps:

**1. Install Python packages:**
```bash
cd backend/python
pip install MetaTrader5 flask flask-cors pandas python-dotenv
```

**2. Enable Python bridge:**
Edit `backend/.env` and change:
```
ENABLE_PYTHON_BRIDGE=true
```

**3. Restart backend:**
- Press Ctrl+C in backend terminal
- Run: `npm run dev`

---

## 🔧 Quick Test Connection

Once you have the server name and Python packages installed:

### Test in MT5 Terminal First:
1. Open MetaTrader 5
2. File → Login to Trade Account
3. Enter:
   - Login: mikkyicon
   - Password: (your password)
   - Server: (your server name)
4. Click "Login"

If it works in MT5, it will work in your web dashboard!

---

## 📋 Common Issues & Solutions

### Issue: "Invalid Account"
**Solution:** Double-check:
- Login is correct (mikkyicon)
- Password is correct
- Server name is exactly as shown (case-sensitive)

### Issue: "Connection Failed"
**Solution:**
- Check internet connection
- Verify server name spelling
- Make sure MT5 terminal can connect first

### Issue: "Authorization Failed"
**Solution:**
- Account might need verification
- Check email for verification link
- Contact broker support

---

## 🎯 What to Do Right Now

**Step 1:** Check your registration email for server name

**Step 2:** Or download MT5 and find server in the dropdown

**Step 3:** Once you have the server, tell me and I'll help you connect!

---

## 💡 Typical Server Names by Broker Type

**Demo Accounts:**
- Usually include "Demo" in the name
- Examples: "Broker-Demo", "Broker-Demo1", "Broker-MT5-Demo"

**Live/Real Accounts:**
- Usually include "Live", "Real", or just the broker name
- Examples: "Broker-Live", "Broker-Real", "Broker-MT5"

**Numbered Servers:**
- Some brokers use numbers: "Broker-Server01", "Broker-Server02"
- Try different numbers if one doesn't work

---

## 📞 Need More Help?

Tell me:
1. Which broker did you register with?
2. Is it a demo or live account?
3. Do you have MT5 terminal installed?

I'll help you find the exact server name!

---

**Once you find the server name, we're ready to connect!** 🚀
