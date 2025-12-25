# Production Deployment Guide - Inpoint Rose Grow

## 🚀 Quick Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Fast2SMS account created with credits
- [ ] Environment variables set in Vercel
- [ ] Images uploaded to `/public/images/`
- [ ] Test OTP system before going live

## 📋 Step-by-Step Deployment

### Step 1: Setup Firebase (Database)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "inpoint-rose-grow" (or your preferred name)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location (choose closest to your users)
   - Click "Enable"

3. **Setup Security Rules**
   - In Firestore, go to "Rules" tab
   - Replace with these rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if true;
       }
     }
   }
   ```
   - Click "Publish"

4. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>) to add web app
   - Register app with nickname "Inpoint Rose Grow Web"
   - Copy all the config values

### Step 2: Setup Fast2SMS (OTP Service)

1. **Create Account**
   - Go to https://www.fast2sms.com/
   - Click "Sign Up"
   - Complete registration with your details
   - Verify your email and mobile number

2. **Add Credits**
   - Go to Dashboard → Recharge
   - Add credits (minimum ₹100 recommended)
   - ₹100 = ~400-600 SMS (depending on plan)

3. **Get API Key**
   - Go to Dashboard → API Keys
   - Copy your API key
   - Keep it secure!

4. **Test API (Optional)**
   - Go to Dashboard → Developer API
   - Test sending an SMS to your number
   - Verify you receive it

### Step 3: Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Production-ready OTP system"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add these variables:

   **Firebase Variables:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = [your-api-key]
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [your-project].firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = [your-project-id]
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [your-project].appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your-sender-id]
   NEXT_PUBLIC_FIREBASE_APP_ID = [your-app-id]
   ```

   **Fast2SMS Variables:**
   ```
   FAST2SMS_API_KEY = [your-fast2sms-api-key]
   FAST2SMS_SENDER_ID = TXTIND
   ```

   **App Variables:**
   ```
   NEXT_PUBLIC_APP_NAME = Inpoint Rose Grow
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   NODE_ENV = production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your production URL

### Step 4: Update App URL

1. Go back to Vercel Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
3. Redeploy the application

### Step 5: Test Production OTP

1. **Open your production URL**
2. **Go to OTP Login page**
3. **Enter a 10-digit Indian mobile number**
4. **Click "Send OTP"**
5. **Check your phone for SMS**
6. **Enter the OTP and verify**

✅ If you receive the OTP and can login, your system is working!

## 🔍 Troubleshooting

### Issue: "SMS service is not configured"

**Solution:**
- Check Vercel environment variables
- Ensure `FAST2SMS_API_KEY` is set correctly
- Verify no extra spaces in the API key
- Redeploy after adding variables

### Issue: "Database not configured"

**Solution:**
- Check all Firebase variables are set
- Ensure Firebase project is active
- Verify Firestore is enabled
- Check Firebase security rules

### Issue: OTP not received

**Possible causes:**
1. **Fast2SMS credits exhausted**
   - Check Fast2SMS dashboard balance
   - Add more credits

2. **Invalid mobile number**
   - Must be exactly 10 digits
   - Must start with 6, 7, 8, or 9
   - No country code needed

3. **DND registered number**
   - Some numbers block promotional SMS
   - Try with a different number

4. **API key invalid**
   - Regenerate API key in Fast2SMS
   - Update in Vercel environment variables

### Issue: "Module not found" errors

**Solution:**
```bash
npm install
npm run build
```
- If build succeeds locally, push to GitHub
- Vercel will rebuild automatically

## 📊 Monitoring

### Check OTP Delivery Status

1. **Fast2SMS Dashboard**
   - Go to Dashboard → Reports
   - View delivery status of all SMS
   - Check failed deliveries

2. **Vercel Logs**
   - Go to Vercel project → Deployments
   - Click on latest deployment
   - View "Functions" logs
   - Look for OTP-related logs

### Check Database

1. **Firebase Console**
   - Go to Firestore Database
   - View "users" collection
   - Check if users are being created
   - Verify data structure

## 🔒 Security Best Practices

1. **Never expose API keys in client code**
   - Use `NEXT_PUBLIC_` prefix only for public variables
   - Keep Fast2SMS key server-side only

2. **Enable Firebase Security Rules**
   - Restrict read/write access
   - Add authentication checks

3. **Rate Limiting**
   - Already implemented (1 OTP per minute)
   - Consider adding IP-based rate limiting

4. **Monitor Usage**
   - Check Fast2SMS usage regularly
   - Set up alerts for unusual activity
   - Monitor Firebase usage

## 💰 Cost Estimation

### Fast2SMS
- ₹100 = ~400-600 SMS
- Average cost per OTP: ₹0.15-0.25
- For 1000 users/month: ~₹150-250

### Firebase
- Free tier: 50K reads, 20K writes per day
- Should be sufficient for small to medium apps
- Upgrade to Blaze plan if needed

### Vercel
- Hobby plan: Free for personal projects
- Pro plan: $20/month for commercial use

## 📱 OTP Flow Diagram

```
User enters mobile number (10 digits)
         ↓
Validation (numeric, length, prefix)
         ↓
Generate 6-digit OTP
         ↓
Store OTP in memory (5 min expiry)
         ↓
Send via Fast2SMS API
         ↓
User receives SMS
         ↓
User enters OTP
         ↓
Verify OTP (max 3 attempts)
         ↓
Success → Login/Register
```

## 🎯 Post-Deployment

1. **Test all features**
   - OTP login
   - User registration
   - Dashboard access
   - Investment features

2. **Share the app**
   - Test WhatsApp sharing (check OG image)
   - Test Facebook sharing
   - Verify metadata displays correctly

3. **Monitor for 24 hours**
   - Check error logs
   - Monitor OTP delivery rate
   - Track user registrations

## 📞 Support

- **Firebase Issues:** https://firebase.google.com/support
- **Fast2SMS Issues:** https://www.fast2sms.com/support
- **Vercel Issues:** https://vercel.com/support

---

**Last Updated:** December 2024
**Version:** 1.0.0
