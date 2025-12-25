# Environment Variables Setup Guide for Inpoint Rose Grow

This document explains how to configure environment variables for both local development and production deployment.

## Required Environment Variables

### 1. Firebase Configuration (REQUIRED FOR PRODUCTION)

Firebase is used for user data storage in production. Get these credentials from [Firebase Console](https://console.firebase.google.com/):

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

**Setup Steps:**
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Go to Project Settings → General
4. Scroll to "Your apps" → Add web app
5. Copy the configuration values

### 2. Fast2SMS Configuration (REQUIRED FOR PRODUCTION OTP)

Fast2SMS is used to send OTP to Indian mobile numbers. Get API key from [Fast2SMS](https://www.fast2sms.com/):

```
FAST2SMS_API_KEY="your-fast2sms-api-key"
FAST2SMS_SENDER_ID="TXTIND"
```

**Setup Steps:**
1. Go to https://www.fast2sms.com/
2. Sign up for an account
3. Go to Dashboard → API Keys
4. Copy your API key
5. Add credits to your account for sending SMS

**Pricing:** Fast2SMS is very affordable for Indian SMS (₹0.15-0.25 per SMS)

### 3. App Configuration

```
NEXT_PUBLIC_APP_NAME="Inpoint Rose Grow"
NEXT_PUBLIC_APP_URL="https://your-app-url.vercel.app"
```

### 4. Email Configuration (Optional)

For email OTP support (optional):

```
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Inpoint Rose Grow <noreply@inpoint.com>"
```

## Local Development Setup

1. Create a `.env.local` file in the project root
2. Add the environment variables listed above
3. For development, you can skip Fast2SMS - OTP will be logged to console
4. Firebase is optional in development - app will use local file storage

## Production Deployment (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the required variables:
   - All Firebase variables (REQUIRED)
   - Fast2SMS API key (REQUIRED)
   - App configuration
4. Redeploy your application

## Testing OTP System

### Development Mode (without Fast2SMS):
- OTP will be printed in the terminal console
- Check the server logs to see the OTP
- No real SMS will be sent

### Production Mode (with Fast2SMS):
- Real SMS will be sent to the mobile number
- OTP is valid for 5 minutes
- Maximum 3 verification attempts
- Rate limiting: 1 OTP per minute

## Security Notes

⚠️ **NEVER commit `.env.local` or `.env` files to Git**
⚠️ **Keep your API keys secret**
⚠️ **Use different Firebase projects for development and production**
⚠️ **Enable Firebase security rules to protect user data**

## Troubleshooting

### "SMS service is not configured"
- Check that FAST2SMS_API_KEY is set in production environment variables
- Verify the API key is valid and has credits

### "Database not configured"
- Check that all Firebase environment variables are set
- Verify Firebase project is active and accessible

### OTP not received
- Check Fast2SMS dashboard for delivery status
- Verify mobile number is exactly 10 digits
- Ensure Fast2SMS account has sufficient credits
- Check if the number is DND registered (may block promotional SMS)

## Support

For issues with:
- Firebase: https://firebase.google.com/support
- Fast2SMS: https://www.fast2sms.com/support
