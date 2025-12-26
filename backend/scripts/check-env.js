const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file does not exist!');
  console.log('Creating .env from .env.example...');
  
  const examplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ .env file created!');
    console.log('\n⚠️  IMPORTANT: Edit backend/.env and set your MySQL password:');
    console.log('   DB_PASSWORD=your_mysql_password');
    console.log('   (Leave empty if MySQL has no password: DB_PASSWORD=)');
  } else {
    console.log('❌ .env.example not found!');
    process.exit(1);
  }
} else {
  console.log('✅ .env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const passwordMatch = envContent.match(/^DB_PASSWORD=(.*)$/m);
  
  if (passwordMatch) {
    const password = passwordMatch[1].trim();
    if (password === 'your_password' || password === '') {
      console.log('\n⚠️  WARNING: DB_PASSWORD is set to default or empty');
      console.log('   If MySQL requires a password, update backend/.env with:');
      console.log('   DB_PASSWORD=your_actual_mysql_password');
    } else {
      console.log('✅ DB_PASSWORD is configured');
    }
  } else {
    console.log('⚠️  DB_PASSWORD not found in .env file');
  }
}

