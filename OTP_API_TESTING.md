# 🧪 OTP API Testing Guide

## Quick Test Commands

### Test Send OTP (Valid Indian Mobile)

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

---

### Test Send OTP (Email)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "user@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "type": "email",
  "identifier": "use***@example.com"
}
```

---

### Test Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "123456",
    "name": "Test User"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "1234567890",
    "name": "Test User",
    "email": "919876543210",
    "wallet": 50,
    ...
  },
  "isNewUser": true
}
```

---

## Error Test Cases

### 1. Invalid Mobile Number (Less than 10 digits)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "987654321"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Mobile number must be exactly 10 digits. You entered 9 digits.",
  "type": "unknown"
}
```

---

### 2. Invalid Mobile Number (More than 10 digits)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "98765432109"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Mobile number must be exactly 10 digits. You entered 11 digits.",
  "type": "unknown"
}
```

---

### 3. Invalid Mobile Number (Wrong Prefix)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "1234567890"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid Indian mobile number. Must start with 6, 7, 8, or 9.",
  "type": "unknown"
}
```

---

### 4. Invalid Mobile Number (Contains Letters)

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "98765abc10"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Mobile number must contain only digits (0-9)",
  "type": "unknown"
}
```

---

### 5. Rate Limit Exceeded (Send OTP twice quickly)

```bash
# First request
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "9876543210"}'

# Second request immediately after
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "9876543210"}'
```

**Expected Response (Second Request):**
```json
{
  "success": false,
  "message": "Please wait 60 seconds before requesting a new OTP.",
  "waitTime": 60
}
```

---

### 6. Invalid OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "000000"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid OTP. 2 attempts remaining.",
  "attemptsRemaining": 2
}
```

---

### 7. OTP Format Invalid (Not 6 digits)

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "12345"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "OTP must be a 6-digit number"
}
```

---

### 8. Missing Identifier

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Email or mobile number is required"
}
```

---

## Testing Workflow

### Complete OTP Flow Test

1. **Send OTP**
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "9876543210"}'
```

2. **Check Console/Email/SMS for OTP**
   - Development: Check terminal console
   - Production: Check SMS or email

3. **Verify OTP**
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "otp": "YOUR_OTP_HERE",
    "name": "Test User"
  }'
```

4. **Verify User Created**
   - Check response for user object
   - Verify wallet balance is 50 (welcome bonus)
   - Check isNewUser flag

---

## Valid Indian Mobile Number Examples

✅ **Valid Numbers:**
- `9876543210` (starts with 9)
- `8765432109` (starts with 8)
- `7654321098` (starts with 7)
- `6543210987` (starts with 6)

❌ **Invalid Numbers:**
- `1234567890` (starts with 1)
- `5432109876` (starts with 5)
- `987654321` (only 9 digits)
- `98765432109` (11 digits)
- `98765abc10` (contains letters)
- `+919876543210` (includes country code - should be just 10 digits)

---

## Environment-Specific Testing

### Development Mode
```bash
# Set in .env.local
NODE_ENV=development

# Behavior:
# - OTP logged to console if credentials not configured
# - Real SMS/Email sent if credentials configured
# - OTP also logged for debugging
```

### Production Mode
```bash
# Set in production environment
NODE_ENV=production

# Behavior:
# - OTP NEVER logged to console
# - Only real SMS/Email sent
# - Credentials MUST be configured
```

---

## Monitoring & Debugging

### Check Configuration
```bash
node scripts/check-otp-config.js
```

### Watch Development Logs
```bash
npm run dev
# Look for:
# 📱 SMS OTP for +919876543210: 123456
# 📧 Email OTP for user@example.com: 654321
# ✅ SMS sent successfully
# ❌ Error messages
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "SMS service is not configured" | Twilio credentials missing in production | Set TWILIO_* env vars |
| "Email service is not configured" | Gmail credentials missing in production | Set EMAIL_* env vars |
| "Invalid phone number format" | Twilio error 21211 | Check phone number format |
| "This phone number is not verified" | Twilio trial account | Verify number or upgrade |
| "Email service authentication failed" | Wrong Gmail credentials | Check App Password |

---

## Production Deployment Testing

Before going live, test these scenarios:

1. ✅ Send OTP to real phone number
2. ✅ Receive SMS within 30 seconds
3. ✅ Verify OTP successfully
4. ✅ Create new user account
5. ✅ Login existing user
6. ✅ Test rate limiting
7. ✅ Test invalid OTP attempts
8. ✅ Test OTP expiry (wait 5+ minutes)
9. ✅ Verify OTP NOT in server logs
10. ✅ Test email OTP flow

---

## Postman Collection

Import this into Postman for easier testing:

```json
{
  "info": {
    "name": "OTP Authentication API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Send OTP (Phone)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"identifier\": \"9876543210\"}"
        },
        "url": "http://localhost:3000/api/auth/send-otp"
      }
    },
    {
      "name": "Send OTP (Email)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"identifier\": \"user@example.com\"}"
        },
        "url": "http://localhost:3000/api/auth/send-otp"
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"identifier\": \"9876543210\", \"otp\": \"123456\", \"name\": \"Test User\"}"
        },
        "url": "http://localhost:3000/api/auth/verify-otp"
      }
    }
  ]
}
```

---

## Need Help?

- Check `OTP_PRODUCTION_READY.md` for complete documentation
- Run `node scripts/check-otp-config.js` to verify setup
- Check server logs for detailed error messages
- Ensure environment variables are properly set

Happy Testing! 🚀
