# OTP Authentication System

This application now supports **passwordless authentication** using OTP (One-Time Password) for both email and phone numbers.

## Features

✅ **Email OTP Login** - Users can login using their email address
✅ **Phone OTP Login** - Users can login using their phone number
✅ **Automatic User Registration** - New users are automatically registered on first OTP login
✅ **Welcome Bonus** - New users receive ₹50 welcome bonus
✅ **Multi-step Flow** - Clean, intuitive UI with step-by-step verification
✅ **Rate Limiting** - Prevents OTP spam with built-in cooldown
✅ **OTP Expiry** - OTPs expire after 5 minutes for security
✅ **Attempt Limiting** - Maximum 3 verification attempts per OTP

## How It Works

### User Flow

1. **Enter Email/Phone** - User enters their email or phone number
2. **Receive OTP** - System sends a 6-digit OTP to the provided contact
3. **Verify OTP** - User enters the OTP to verify their identity
4. **Complete Profile** (New Users Only) - New users provide their name
5. **Login Success** - User is logged in and redirected to dashboard

### For Developers

#### Development Mode

In development mode, OTPs are logged to the console instead of being sent via email/SMS:

```
📧 Email OTP for user@example.com: 123456
📱 SMS OTP for +1234567890: 123456
```

Check your terminal/console to see the OTP when testing.

#### Production Setup

To enable actual email and SMS sending in production:

##### Email Setup (Using Nodemailer)

1. Install nodemailer:
   ```bash
   npm install nodemailer
   ```

2. Add environment variables to `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="Your App Name <noreply@yourapp.com>"
   ```

3. Uncomment the email sending code in `lib/messaging.ts`

##### SMS Setup (Using Twilio)

1. Install Twilio:
   ```bash
   npm install twilio
   ```

2. Add environment variables to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. Uncomment the SMS sending code in `lib/messaging.ts`

#### Alternative Providers

You can also use:
- **Email**: SendGrid, AWS SES, Mailgun, Postmark
- **SMS**: AWS SNS, MessageBird, Vonage (Nexmo), Plivo

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp
Body: { "identifier": "email@example.com" or "+1234567890" }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { 
  "identifier": "email@example.com",
  "otp": "123456",
  "name": "John Doe" (optional, for new users)
}
```

## Security Features

- **OTP Expiry**: OTPs expire after 5 minutes
- **Attempt Limiting**: Maximum 3 verification attempts
- **Rate Limiting**: Prevents multiple OTP requests in short time
- **Normalized Identifiers**: Phone numbers are normalized to prevent duplicates
- **Secure Storage**: OTPs are stored in memory (use Redis in production for scalability)

## File Structure

```
lib/
  ├── otp.ts              # OTP generation, storage, and verification
  └── messaging.ts        # Email and SMS sending utilities

app/api/auth/
  ├── send-otp/route.ts   # API to send OTP
  └── verify-otp/route.ts # API to verify OTP and login

app/
  └── otp-login/page.tsx  # OTP login UI
```

## Upgrading to Production

### Use Redis for OTP Storage

For production, replace the in-memory OTP store with Redis:

```typescript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

export async function storeOTP(identifier: string, otp: string) {
  await redis.setEx(`otp:${identifier}`, 300, otp); // 5 minutes
}

export async function verifyOTP(identifier: string, otp: string) {
  const stored = await redis.get(`otp:${identifier}`);
  if (stored === otp) {
    await redis.del(`otp:${identifier}`);
    return { success: true, message: 'OTP verified' };
  }
  return { success: false, message: 'Invalid OTP' };
}
```

## Testing

### Test Email OTP
1. Go to `/otp-login`
2. Enter: `test@example.com`
3. Check console for OTP
4. Enter the OTP shown in console

### Test Phone OTP
1. Go to `/otp-login`
2. Enter: `+1234567890`
3. Check console for OTP
4. Enter the OTP shown in console

## Support

For issues or questions, please check the documentation or contact support.
