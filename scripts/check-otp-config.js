/**
 * OTP Configuration Helper
 * 
 * This file helps you verify your OTP setup configuration.
 * Run this file to check if all required environment variables are set.
 */

const requiredEnvVars = {
    email: ['EMAIL_USER', 'EMAIL_APP_PASSWORD'],
    sms: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
    optional: ['APP_NAME']
};

function checkConfiguration() {
    console.log('🔍 Checking OTP Configuration...\n');

    let hasErrors = false;

    // Check Email Configuration
    console.log('📧 Email OTP Configuration:');
    requiredEnvVars.email.forEach(envVar => {
        const value = process.env[envVar];
        if (value) {
            console.log(`  ✅ ${envVar}: ${envVar.includes('PASSWORD') ? '****' : value}`);
        } else {
            console.log(`  ❌ ${envVar}: NOT SET`);
            hasErrors = true;
        }
    });

    console.log('\n📱 SMS OTP Configuration:');
    requiredEnvVars.sms.forEach(envVar => {
        const value = process.env[envVar];
        if (value) {
            console.log(`  ✅ ${envVar}: ${envVar.includes('TOKEN') ? '****' : value}`);
        } else {
            console.log(`  ❌ ${envVar}: NOT SET`);
            hasErrors = true;
        }
    });

    console.log('\n⚙️ Optional Configuration:');
    requiredEnvVars.optional.forEach(envVar => {
        const value = process.env[envVar];
        console.log(`  ${value ? '✅' : '⚠️'} ${envVar}: ${value || 'NOT SET (will use default)'}`);
    });

    console.log('\n' + '='.repeat(60));

    if (hasErrors) {
        console.log('\n❌ Configuration Incomplete!');
        console.log('\nTo fix:');
        console.log('1. Create/edit .env.local file in project root');
        console.log('2. Add missing environment variables');
        console.log('3. Refer to OTP_SETUP_GUIDE.md for detailed instructions');
        console.log('\n⚠️ In development mode, OTPs will be logged to console.');
    } else {
        console.log('\n✅ Configuration Complete!');
        console.log('\nYour OTP system is ready to use:');
        console.log('  • Email OTP will be sent via Gmail');
        console.log('  • SMS OTP will be sent via Twilio');
        console.log('  • OTP expires in 5 minutes');
        console.log('  • Maximum 3 verification attempts');
        console.log('  • Maximum 3 resend attempts');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    return !hasErrors;
}

// Export for use in other files
export { checkConfiguration };

// Run check if executed directly
if (require.main === module) {
    checkConfiguration();
}
