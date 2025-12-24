# 🚀 QUICK START GUIDE - OTP Authentication

## ⚡ Get Started in 3 Steps

### Step 1: Configure Environment (2 minutes)

```bash
# Copy the template
cp env.template .env.local

# Edit .env.local and add your credentials
# (See detailed instructions below)
```

### Step 2: Verify Configuration (30 seconds)

```bash
node scripts/check-otp-config.js
```

### Step 3: Start Development (10 seconds)

```bash
npm run dev
```

---

## 📝 Detailed Setup

### Option A: Test Without Credentials (Fastest)

**Perfect for initial testing!**

1. Copy `env.template` to `.env.local`
2. Leave credentials empty
3. Run `npm run dev`
4. OTP will be logged to console

**Example:**
```bash
cp env.template .env.local
npm run dev
```

When you send OTP, you'll see:
```
============================================================
📱 DEVELOPMENT MODE - SMS OTP
============================================================
Phone: +919876543210
OTP: 123456
Message: Your OTP for Investment App is: 123456...
============================================================
```

### Option B: Test With Real SMS/Email

**For production-like testing:**

#### Gmail Setup (5 minutes)

1. Go to https://myaccount.google.com/
2. Enable **2-Step Verification**
3. Go to https://myaccount.google.com/apppasswords
4. Create new app password
5. Copy the 16-digit password
6. Add to `.env.local`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

#### Twilio Setup (10 minutes)

1. Sign up at https://www.twilio.com/try-twilio
2. Get a phone number (free trial gives $15 credit)
3. Copy credentials from dashboard
4. Add to `.env.local`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**For Trial Accounts:**
- Verify your phone number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- Trial can only send to verified numbers

---

## 🧪 Test the System

### Test 1: Send OTP (Phone)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "9876543210"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your mobile number",
  "type": "phone",
  "identifier": "9187****10"
}
```

### Test 2: Check Console/SMS for OTP

- **Without credentials**: Check terminal console
- **With credentials**: Check your phone/email

### Test 3: Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "YOUR_OTP_HERE",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": { ... },
  "isNewUser": true
}
```

---

## ✅ Validation Rules

### Valid Indian Mobile Numbers
- ✅ Exactly 10 digits
- ✅ Only numbers (0-9)
- ✅ Must start with 6, 7, 8, or 9

### Examples
- ✅ `9876543210` - Valid
- ✅ `8765432109` - Valid
- ✅ `7654321098` - Valid
- ❌ `987654321` - Too short (9 digits)
- ❌ `98765432109` - Too long (11 digits)
- ❌ `1234567890` - Invalid prefix (starts with 1)
- ❌ `98765abc10` - Contains letters

---

## 🔄 Common Workflows

### Workflow 1: New User Registration

1. User enters mobile number: `9876543210`
2. System validates number
3. System generates and sends OTP
4. User receives OTP: `123456`
5. User enters OTP
6. System verifies OTP
7. System creates new account with ₹50 welcome bonus

### Workflow 2: Existing User Login

1. User enters mobile number: `9876543210`
2. System validates number
3. System generates and sends OTP
4. User receives OTP: `654321`
5. User enters OTP
6. System verifies OTP
7. System logs in existing user

---

## 🚨 Error Handling

### Error 1: Invalid Mobile Number

**Input:** `987654321` (9 digits)

**Response:**
```json
{
  "success": false,
  "message": "Mobile number must be exactly 10 digits. You entered 9 digits."
}
```

### Error 2: Invalid Prefix

**Input:** `1234567890`

**Response:**
```json
{
  "success": false,
  "message": "Invalid Indian mobile number. Must start with 6, 7, 8, or 9."
}
```

### Error 3: Invalid OTP

**Input:** Wrong OTP

**Response:**
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining.",
  "attemptsRemaining": 2
}
```

### Error 4: Rate Limited

**Input:** Send OTP twice within 1 minute

**Response:**
```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting a new OTP.",
  "waitTime": 45
}
```

---

## 📊 Environment Modes

### Development Mode (`NODE_ENV=development`)

**Behavior:**
- ✅ OTP logged to console if credentials not configured
- ✅ Real SMS/Email sent if credentials configured
- ✅ OTP also logged for debugging
- ✅ Detailed error messages

**Perfect for:**
- Local development
- Testing without SMS costs
- Debugging

### Production Mode (`NODE_ENV=production`)

**Behavior:**
- ✅ Real SMS/Email ONLY
- ✅ OTP NEVER logged to console
- ✅ Credentials REQUIRED
- ✅ Secure error messages

**Perfect for:**
- Live server
- Real users
- Production deployment

---

## 🎯 Production Deployment

### 1. Configure Environment Variables

In your hosting platform (Vercel, Netlify, etc.), set:

```env
NODE_ENV=production
APP_NAME=Your App Name
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Deploy

```bash
# Build for production
npm run build

# Deploy to your platform
# (Vercel, Netlify, etc.)
```

### 3. Test Production

1. Send OTP to a real phone number
2. Verify OTP is received via SMS
3. Check that OTP is NOT in server logs
4. Test complete registration flow

---

## 📚 Documentation

- **`IMPLEMENTATION_SUMMARY.md`** - What was implemented
- **`OTP_PRODUCTION_READY.md`** - Complete setup guide
- **`OTP_API_TESTING.md`** - API testing examples
- **`env.template`** - Environment configuration

---

## 🆘 Need Help?

### Check Configuration
```bash
node scripts/check-otp-config.js
```

### Common Issues

**Issue:** OTP not received (SMS)
- ✅ Check Twilio credentials
- ✅ Check Twilio console logs
- ✅ Verify phone number (for trial accounts)

**Issue:** OTP not received (Email)
- ✅ Check Gmail credentials
- ✅ Use App Password (not regular password)
- ✅ Check spam folder

**Issue:** "Service not configured"
- ✅ Set environment variables
- ✅ Restart server after changing .env.local

---

## ✨ You're Ready!

Your OTP system is production-ready. Start testing now:

```bash
# 1. Verify config
node scripts/check-otp-config.js

# 2. Start dev server
npm run dev

# 3. Test OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "9876543210"}'
```

**Happy coding! 🚀**
