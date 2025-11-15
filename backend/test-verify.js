import Paystack from 'paystack-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing Paystack Transaction Verify...\n');

if (!process.env.PAYSTACK_SECRET_KEY) {
  console.error('❌ PAYSTACK_SECRET_KEY is not set');
  process.exit(1);
}

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// Test with a sample reference (this will likely fail as it's not a real transaction)
const testReference = 'qnsruaudnu'; // The reference from your error

console.log('Testing verify method with reference:', testReference);
console.log('Reference type:', typeof testReference);
console.log('Reference length:', testReference.length);

try {
  console.log('\n1. Testing with string parameter:');
  const response1 = await paystack.transaction.verify(testReference);
  console.log('✅ Success with string!');
  console.log('Response:', JSON.stringify(response1, null, 2));
} catch (error1) {
  console.log('❌ Failed with string:');
  console.log('   Error message:', error1.message);
  console.log('   Error type:', error1.constructor.name);
  
  if (error1.message.includes('in')) {
    console.log('   ⚠️ This is the "in operator" error!');
  }
}

try {
  console.log('\n2. Testing with object parameter:');
  const response2 = await paystack.transaction.verify({ reference: testReference });
  console.log('✅ Success with object!');
  console.log('Response:', JSON.stringify(response2, null, 2));
} catch (error2) {
  console.log('❌ Failed with object:');
  console.log('   Error message:', error2.message);
  console.log('   Error type:', error2.constructor.name);
}

console.log('\n3. Checking SDK methods available:');
console.log('   paystack.transaction type:', typeof paystack.transaction);
console.log('   paystack.transaction.verify type:', typeof paystack.transaction.verify);

// Check if there's alternative method names
const transactionMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(paystack.transaction));
console.log('   Available transaction methods:', transactionMethods);
