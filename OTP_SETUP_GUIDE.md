# OTP Authentication System - Setup Guide

## 🚀 Production-Ready OTP Authentication

This system provides **real OTP delivery** via Email and SMS without any separate OTP button. When users click "Create Account", OTP is automatically sent.

## 📋 Features

✅ Automatic OTP sending on account creation
✅ Real Email OTP via Gmail/SMTP (Nodemailer)
✅ Real SMS OTP via Twilio
✅ 5-minute OTP expiry
✅ Maximum 3 verification attempts
✅ Maximum 3 resend attempts
✅ Resend OTP with 60-second cooldown
✅ Clean two-step UI flow
✅ Production-ready error handling

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Email OTP (Gmail)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Step Verification
3. Generate App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-digit password

4. Add to `.env.local`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
APP_NAME=Investment App
```

### 3. Configure SMS OTP (Twilio)

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get a phone number (Trial or Paid)
3. Copy credentials from [Twilio Console](https://console.twilio.com/)

4. Add to `.env.local`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Alternative Email Services

Instead of Gmail, you can use:

**SendGrid:**
```typescript
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

**AWS SES:**
```typescript
const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASSWORD
    }
});
```

## 🎯 How It Works

### User Flow:

1. **User fills registration form** (Name, Email/Phone, Password)
2. **Clicks "Create Account & Send OTP"**
3. **OTP automatically sent** to email or phone
4. **User enters 6-digit OTP**
5. **Account created** after successful verification

### Technical Flow:

```
User Form Submission
    ↓
POST /api/auth/send-otp
    ↓
Generate 6-digit OTP
    ↓
Store in memory (5 min expiry)
    ↓
Send via Email/SMS
    ↓
User enters OTP
    ↓
POST /api/auth/verify-otp
    ↓
Verify OTP (3 attempts max)
    ↓
POST /api/auth/register
    ↓
Account Created ✅
```

## 📁 File Structure

```
lib/
├── otp.ts              # OTP generation & verification logic
├── messaging.ts        # Email & SMS sending (Production)
└── otp-service.ts      # Combined OTP service (Alternative)

app/api/auth/
├── send-otp/route.ts   # Send OTP endpoint
├── verify-otp/route.ts # Verify OTP endpoint
└── register/route.ts   # User registration endpoint

app/create-account/
└── page.tsx            # Registration UI with OTP flow
```

## 🔒 Security Features

- **OTP Expiry:** 5 minutes
- **Attempt Limits:** Max 3 verification attempts
- **Resend Limits:** Max 3 resend requests
- **Rate Limiting:** 60-second cooldown between resends
- **Secure Storage:** In-memory (use Redis in production)
- **Password Hashing:** Implemented in registration

## 🧪 Testing

### Development Mode (Console Logging)

If email/SMS credentials are not configured, OTPs will be logged to console:

```
📧 Email OTP for user@example.com: 123456
📱 SMS OTP for +919876543210: 654321
```

### Production Mode

Configure all environment variables for real delivery.

## 🚨 Important Notes

1. **Gmail App Password:** Regular Gmail password won't work. You MUST use App Password.
2. **Twilio Trial:** Free trial has limitations. Verify your phone number first.
3. **Redis Recommended:** For production, replace in-memory OTP storage with Redis.
4. **Rate Limiting:** Consider adding rate limiting middleware for API routes.
5. **Phone Format:** Indian numbers supported (+91 or 10 digits).

## 📞 Support

For issues:
1. Check console for error messages
2. Verify environment variables
3. Test with development mode first
4. Check Twilio/Gmail logs

## 🎨 UI Features

- ✨ Clean two-step interface
- 📱 Automatic OTP type detection (Email/SMS)
- ⏱️ Countdown timer for resend
- 🔄 Resend OTP functionality
- ✅ Real-time validation
- 🎯 Clear error messages

## 🔄 Migration from Old System

If you had a separate OTP button before:
1. Old flow is replaced automatically
2. No database migration needed
3. Existing users can still login normally
4. New users get OTP verification

## 📝 Environment Variables Template

Create `.env.local` with:

```env
# Email OTP
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
APP_NAME=Investment App

# SMS OTP
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Environment
NODE_ENV=development
```

---

**Ready to use!** 🎉 Just configure your credentials and start testing.
