const { execSync } = require('child_process');

console.log('🔍 Running pre-commit checks...\n');

let hasErrors = false;

// Function to run a command and handle errors
function runCheck(name, command, required = true) {
  console.log(`📋 ${name}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name} passed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed\n`);
    if (required) {
      hasErrors = true;
    }
    return false;
  }
}

// Run all checks
console.log('='.repeat(50));
console.log('🚀 SMARTCHART PRO - PRE-COMMIT CHECKS');
console.log('='.repeat(50));

runCheck('TypeScript Check', 'npm run ts:check');
runCheck('ESLint Check', 'npm run lint');
runCheck('Build Check', 'npm run build');

console.log('='.repeat(50));

if (hasErrors) {
  console.error('❌ PRE-COMMIT CHECKS FAILED!');
  console.error('Please fix the errors above before committing.');
  process.exit(1);
} else {
  console.log('✅ ALL PRE-COMMIT CHECKS PASSED!');
  console.log('Your code is ready for commit and CI/CD.');
}

console.log('='.repeat(50));
