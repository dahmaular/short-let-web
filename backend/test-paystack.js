import Paystack from 'paystack-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing Paystack Integration...\n');

// Check if key exists
if (!process.env.PAYSTACK_SECRET_KEY) {
  console.error('❌ PAYSTACK_SECRET_KEY is not set in .env file');
  process.exit(1);
}

console.log('✓ PAYSTACK_SECRET_KEY found');
console.log(`  Key format: ${process.env.PAYSTACK_SECRET_KEY.substring(0, 12)}...`);
console.log(`  Key length: ${process.env.PAYSTACK_SECRET_KEY.length} characters\n`);

// Initialize Paystack
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// Test the key by fetching transaction list (lightweight test)
console.log('Testing API connection...');

try {
  const response = await paystack.transaction.list({
    perPage: 1
  });

  if (response.status) {
    console.log('✅ Paystack API connection successful!');
    console.log('   Your Paystack keys are valid and working.\n');
  } else {
    console.error('❌ API request failed:', response.message);
  }
} catch (error) {
  console.error('❌ Error testing Paystack API:');
  console.error('   Message:', error.message);
  
  if (error.message.includes('Invalid key')) {
    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Go to https://dashboard.paystack.com/settings/developer');
    console.error('   2. Copy your Secret Key (starts with sk_test_ for test mode)');
    console.error('   3. Update PAYSTACK_SECRET_KEY in your .env file');
    console.error('   4. Make sure there are no extra spaces or quotes');
    console.error('   5. Restart your server after updating .env\n');
  }
  
  process.exit(1);
}
