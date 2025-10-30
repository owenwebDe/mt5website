# 🏦 CribMarket MT5 Connection Guide

## Your Account Details

- **Login:** mikkyicon
- **Password:** ******** (you have it)
- **Broker:** CribMarket
- **Server:** (finding it now...)

---

## 🔍 Common CribMarket MT5 Server Names

CribMarket typically uses these server names:

### Most Common:
```
CribMarket-Demo
CribMarket-Live
CribMarket-MT5
CribMarket-Server
Crib-Demo
Crib-Live
```

### Try These First:
1. **CribMarket-Demo** (if it's a demo account)
2. **CribMarket-Live** (if it's a live account)
3. **CribMarket-MT5**
4. **CribMarket-Server**

---

## 📧 Check Your Email

Look for an email from CribMarket with subject like:
- "Welcome to CribMarket"
- "Your MT5 Account Details"
- "Trading Account Created"
- "Registration Successful"

The email should contain:
```
Login: mikkyicon
Password: ********
Server: CribMarket-[Something]
```

---

## 💻 Find Server in MT5 Terminal

### Step 1: Download MT5 (if not installed)
https://www.metatrader5.com/en/download

### Step 2: Open MT5 and Find CribMarket Server

1. Open MetaTrader 5
2. **File → Login to Trade Account**
3. In the Server dropdown, type: **"Crib"**
4. You should see CribMarket servers appear

### Step 3: Try to Login
- Login: **mikkyicon**
- Password: (your password)
- Server: (select from dropdown)
- Click **Login**

If it connects successfully in MT5 terminal, use that same server name in the web dashboard!

---

## 🌐 Check CribMarket Website

### Option 1: Help/Support Page
1. Go to CribMarket website
2. Look for: "MT5 Servers" or "Trading Platforms"
3. They usually list server names there

### Option 2: Contact Support
- **Live Chat:** Most brokers have instant chat
- **Email:** support@cribmarket.com (or similar)
- **Phone:** Check their website

Ask them: *"What is the MT5 server name for login: mikkyicon?"*

They'll respond immediately with the exact server name.

---

## 🎯 Once You Have the Server Name

### Step 1: Install Python Packages First

The Python packages are required for MT5 connection:

```bash
cd "c:\Users\Admin\Documents\all my website\mt5 web\2nd try\backend\python"
pip install MetaTrader5 flask flask-cors pandas python-dotenv
```

**If pip fails due to proxy**, try:
```bash
# Option 1: Try with your mobile hotspot
# Option 2: Download packages manually
# Option 3: Contact IT for pip access
```

### Step 2: Enable Python Bridge

Edit `backend/.env`:
```
ENABLE_PYTHON_BRIDGE=true
```

### Step 3: Restart Backend

In your backend terminal:
- Press **Ctrl+C** to stop
- Run: `npm run dev`

### Step 4: Connect via Web Dashboard

1. Open: http://localhost:5173
2. Enter:
   - **Account:** mikkyicon
   - **Password:** (your password)
   - **Server:** (CribMarket server name)
3. Click **"Connect to MT5"**

---

## ⚠️ Current Status Reminder

**What's Working:**
- ✅ Frontend running on localhost:5173
- ✅ Backend running on localhost:3001
- ✅ UI is beautiful and responsive

**What Needs Fixing:**
- ⚠️ Python packages not installed (pip proxy issue)
- ⚠️ Python bridge disabled
- ⚠️ Can't connect to MT5 yet

**Priority Actions:**
1. Find CribMarket server name
2. Fix pip/install Python packages
3. Enable Python bridge
4. Connect to MT5

---

## 🚀 Quick Action Plan

### Right Now:

**Action 1:** Check your registration email from CribMarket
- Look for server name

**Action 2:** Or download MT5 terminal
- Find "Crib" in server list
- Try to login there first

**Action 3:** Tell me the server name once you find it
- I'll help you connect!

### After Finding Server:

**Action 4:** Fix Python packages
- Try different internet connection
- Or use mobile hotspot
- Install: MetaTrader5, flask, flask-cors, pandas

**Action 5:** Test connection
- Enable Python bridge
- Restart backend
- Login via web dashboard

---

## 💡 Pro Tips

### Test in MT5 First
Always test your credentials in the actual MT5 terminal first:
- If it works there → it will work in web dashboard
- If it fails there → check credentials/server name

### Common Mistakes
- ❌ Wrong server name (case-sensitive!)
- ❌ Typing "CribMarket" when it's "Crib-Market"
- ❌ Using Demo server for Live account (or vice versa)
- ❌ Extra spaces in server name

### Server Name Format
Usually one of these patterns:
- `CribMarket-Demo`
- `CribMarket-Live`
- `Crib-Demo`
- `Crib-MT5`

---

## 📞 Need Help?

Tell me:
1. Did you check your email? What does it say?
2. Do you have MT5 terminal installed?
3. Is this a Demo or Live account?
4. Can you see any server names in MT5 dropdown?

I'll help you connect! 🎯

---

## 🎉 Almost There!

You're very close to having a fully functional trading dashboard:
- ✅ Complete codebase
- ✅ Beautiful UI
- ✅ Account registered
- 🔄 Just need: Server name + Python packages

Let's finish this! 🚀
