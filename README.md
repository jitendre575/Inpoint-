# 🌹 Inpoint Rose Grow - Smart Investment Platform

A production-ready Next.js investment platform with secure email/password authentication.

![Inpoint Rose Grow](./public/images/inpoint-rose-grow-og.png)

## ✨ Features

- 🔐 **Secure Email/Password Authentication** - Simple and secure login system
- 💰 **Investment Management** - Track and manage your investments
- 📊 **Real-time Dashboard** - Monitor your portfolio performance
- 💳 **Deposit & Withdrawal** - Easy fund management
- 💬 **Support Chat** - Direct communication with admin
- 🎁 **Welcome Bonus** - ₹50 bonus for new users
- 📱 **Mobile App Download** - Easy access to mobile application
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Firebase account (for database)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mobile-app-structures

# Install dependencies
pnpm install

# Copy environment template
cp env.template .env.local

# Edit .env.local with your configuration
# Set NEXT_PUBLIC_PLAYSTORE_URL to your Play Store link

# Run development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=com.yourapp
APP_NAME=Inpoint Rose Grow

# Environment
NODE_ENV=development

# Firebase (Optional - for database)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 📖 Documentation

- **[Authentication Guide](./AUTHENTICATION_GUIDE.md)** - Complete authentication documentation
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Step-by-step production deployment
- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Configure environment variables

## 🔐 Authentication System

### Current Setup: Email/Password Only

- ✅ **Login**: Email/Username + Password
- ❌ **OTP Login**: DISABLED
- ❌ **Phone Login**: DISABLED
- ❌ **Public Registration**: DISABLED

### Security Features

1. **Login Page** (`/login`)
   - Email/Username + Password authentication
   - Session management via localStorage
   - Welcome bonus on first login
   - Download Mobile App button

2. **Registration Disabled**
   - Public registration completely blocked
   - `/create-account` redirects to `/login`
   - API endpoint returns 403 Forbidden
   - New users created by admins only

3. **OTP System Removed**
   - All OTP endpoints disabled (403 Forbidden)
   - No SMS/Email OTP functionality
   - No Firebase OTP integration
   - Clean codebase without OTP dependencies

See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for complete details.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** Firebase Firestore (optional)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics

## 📁 Project Structure

```
mobile-app-structures/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication APIs
│   │   │   ├── login/     # Email/Password login (ACTIVE)
│   │   │   ├── register/  # Registration (DISABLED - 403)
│   │   │   ├── otp-login/ # OTP login (DISABLED - 403)
│   │   │   ├── send-otp/  # Send OTP (DISABLED - 403)
│   │   │   └── verify-otp/# Verify OTP (DISABLED - 403)
│   │   ├── user/          # User management APIs
│   │   └── support/       # Support chat APIs
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   ├── login/             # Login page (ACTIVE)
│   ├── create-account/    # Redirects to login
│   └── layout.tsx         # Root layout with metadata
├── lib/
│   ├── db.ts              # Database operations
│   └── firebase.ts        # Firebase configuration
├── components/
│   ├── download-app-button.tsx  # Mobile app download button
│   ├── bottom-nav.tsx           # Bottom navigation
│   └── ui/                      # Reusable UI components
├── public/
│   └── images/            # App images and icons
└── docs/                  # Documentation files
```

## 🧪 Testing

### Login Flow Testing
```bash
pnpm run dev
```
1. Navigate to `/login`
2. Enter existing user email + password
3. Click "Login"
4. Should redirect to `/dashboard`
5. Download App button should be visible

### Security Testing
1. Try accessing `/create-account` → Should redirect to `/login`
2. Try POST to `/api/auth/register` → Should return 403
3. Try POST to `/api/auth/send-otp` → Should return 403
4. No OTP-related UI should be visible

## 📱 Mobile App Download

### Download Button Locations:
1. **Login Page** - Below login form
2. **Dashboard Header** - Top-right corner (desktop)

### Configuration:
Set your Play Store URL in `.env.local`:
```env
NEXT_PUBLIC_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=com.yourapp
```

The button will automatically use this URL for downloads.

## 🔒 Security Features

- ✅ Email/Password authentication only
- ✅ Public registration disabled
- ✅ OTP system completely removed
- ✅ Secure password hashing
- ✅ Environment-based configuration
- ✅ No secrets in code
- ✅ Protected API endpoints
- ✅ Session management
- ✅ Admin-only user creation

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

Or manually:

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_PLAYSTORE_URL`
   - `NODE_ENV=production`
4. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📱 Features Overview

### For Users
- 🔐 Email/Password login
- 💰 View wallet balance
- 📊 Track investment history
- 💳 Deposit funds with UTR upload
- 💸 Request withdrawals
- 💬 Chat with support
- 🎁 ₹50 welcome bonus
- 📱 Download mobile app

### For Admins
- 👥 View all users
- ➕ Create new user accounts
- ✅ Approve/reject deposits
- 💸 Process withdrawals
- 💬 Support chat management
- 📊 User analytics

## 🎯 Roadmap

- [x] Email/Password authentication
- [x] Disable public registration
- [x] Remove OTP system
- [x] Add mobile app download button
- [ ] Add more payment gateways
- [ ] Implement investment plans
- [ ] Add referral system
- [ ] Advanced analytics
- [ ] Multi-language support

## ⚡ Performance

- ✅ Next.js 16 with Turbopack
- ✅ Optimized images
- ✅ Code splitting
- ✅ Server-side rendering
- ✅ Edge functions

## 📞 Support

For issues or questions:
- Check [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Firebase Support: https://firebase.google.com/support

## 🌟 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and analytics
- Firebase for database services
- Radix UI for accessible components

---

**Built with ❤️ for investors**

**Version:** 2.0.0  
**Last Updated:** January 2026  
**Status:** ✅ Production Ready  
**Authentication:** Email/Password Only
