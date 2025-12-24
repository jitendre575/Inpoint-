/**
 * OTP Configuration Verification Script
 * Run this to check if your environment is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔍 OTP CONFIGURATION VERIFICATION');
console.log('='.repeat(60) + '\n');

// Load environment variables from .env.local
function loadEnvFile() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const env = {};

    try {
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key && valueParts.length > 0) {
                        env[key.trim()] = valueParts.join('=').trim();
                    }
                }
            }
            console.log('✅ Found .env.local file\n');
        } else {
            console.log('⚠️  .env.local file not found');
            console.log('   Copy env.template to .env.local and configure it\n');
        }
    } catch (error) {
        console.log('❌ Error reading .env.local:', error.message, '\n');
    }

    return env;
}

const env = loadEnvFile();

let allGood = true;
const warnings = [];
const errors = [];

// Check Node Environment
console.log('📍 Environment Check:');
const nodeEnv = env.NODE_ENV || process.env.NODE_ENV || 'development';
console.log(`   NODE_ENV: ${nodeEnv}`);

if (nodeEnv === 'production') {
    console.log('   ⚠️  Production mode detected - OTP will NOT be logged to console\n');
} else {
    console.log('   ℹ️  Development mode - OTP will be logged if credentials missing\n');
}

// Check Email Configuration
console.log('📧 Email Configuration (Gmail):');
const emailUser = env.EMAIL_USER || process.env.EMAIL_USER;
const emailPassword = env.EMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD;

if (emailUser && emailPassword) {
    console.log(`   ✅ EMAIL_USER: ${emailUser}`);
    console.log(`   ✅ EMAIL_APP_PASSWORD: ${'*'.repeat(emailPassword.length)}`);

    if (emailPassword.length !== 16) {
        warnings.push('EMAIL_APP_PASSWORD should be 16 characters (Gmail App Password)');
        console.log('   ⚠️  Warning: App Password should be 16 characters');
    }
} else {
    if (nodeEnv === 'production') {
        errors.push('Email credentials missing in production');
        console.log('   ❌ EMAIL_USER: Not configured');
        console.log('   ❌ EMAIL_APP_PASSWORD: Not configured');
        allGood = false;
    } else {
        warnings.push('Email credentials not configured - OTP will be logged to console');
        console.log('   ⚠️  EMAIL_USER: Not configured (will use console logging)');
        console.log('   ⚠️  EMAIL_APP_PASSWORD: Not configured (will use console logging)');
    }
}
console.log('');

// Check SMS Configuration
console.log('📱 SMS Configuration (Twilio):');
const twilioSid = env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
const twilioToken = env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;

if (twilioSid && twilioToken && twilioPhone) {
    console.log(`   ✅ TWILIO_ACCOUNT_SID: ${twilioSid.substring(0, 10)}...`);
    console.log(`   ✅ TWILIO_AUTH_TOKEN: ${'*'.repeat(20)}`);
    console.log(`   ✅ TWILIO_PHONE_NUMBER: ${twilioPhone}`);

    if (!twilioSid.startsWith('AC')) {
        warnings.push('TWILIO_ACCOUNT_SID should start with "AC"');
        console.log('   ⚠️  Warning: Account SID should start with "AC"');
    }

    if (!twilioPhone.startsWith('+')) {
        warnings.push('TWILIO_PHONE_NUMBER should include country code (e.g., +1234567890)');
        console.log('   ⚠️  Warning: Phone number should include country code');
    }
} else {
    if (nodeEnv === 'production') {
        errors.push('Twilio credentials missing in production');
        console.log('   ❌ TWILIO_ACCOUNT_SID: Not configured');
        console.log('   ❌ TWILIO_AUTH_TOKEN: Not configured');
        console.log('   ❌ TWILIO_PHONE_NUMBER: Not configured');
        allGood = false;
    } else {
        warnings.push('Twilio credentials not configured - OTP will be logged to console');
        console.log('   ⚠️  TWILIO_ACCOUNT_SID: Not configured (will use console logging)');
        console.log('   ⚠️  TWILIO_AUTH_TOKEN: Not configured (will use console logging)');
        console.log('   ⚠️  TWILIO_PHONE_NUMBER: Not configured (will use console logging)');
    }
}
console.log('');

// Check App Name
console.log('🏷️  App Configuration:');
const appName = env.APP_NAME || process.env.APP_NAME || 'Investment App';
console.log(`   APP_NAME: ${appName}\n`);

// Summary
console.log('='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60) + '\n');

if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(err => console.log(`   - ${err}`));
    console.log('');
}

if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(warn => console.log(`   - ${warn}`));
    console.log('');
}

if (allGood && errors.length === 0) {
    if (warnings.length === 0) {
        console.log('✅ All configurations are properly set!');
        console.log('   You can now run: npm run dev\n');
    } else {
        console.log('✅ Configuration is valid for development');
        console.log('   OTP will be logged to console for testing\n');
    }
} else {
    console.log('❌ Configuration issues detected');
    console.log('   Please fix the errors above before deploying to production\n');
}

// Next Steps
console.log('='.repeat(60));
console.log('📝 NEXT STEPS');
console.log('='.repeat(60) + '\n');

if (nodeEnv === 'development') {
    if (warnings.length > 0) {
        console.log('For Development:');
        console.log('1. You can test OTP with console logging (no credentials needed)');
        console.log('2. To test real SMS/Email, configure credentials in .env.local');
        console.log('3. See env.template for setup instructions\n');
    } else {
        console.log('For Development:');
        console.log('1. Run: npm run dev');
        console.log('2. Test OTP sending - real SMS/Email will be sent');
        console.log('3. OTP will also be logged to console for debugging\n');
    }
} else {
    console.log('For Production:');
    console.log('1. Ensure all credentials are configured');
    console.log('2. Set NODE_ENV=production in your hosting environment');
    console.log('3. OTP will NEVER be logged to console in production');
    console.log('4. Only real SMS/Email will be sent\n');
}

console.log('For detailed setup instructions, see:');
console.log('- OTP_PRODUCTION_READY.md');
console.log('- env.template\n');

console.log('='.repeat(60) + '\n');
