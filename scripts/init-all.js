const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting complete initialization...');

// 1. Create .env.local file
const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/uttarakhand_gi_products
MONGODB_DB_NAME=uttarakhand_gi_products

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dw2x4yxc4
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
CLOUDINARY_FOLDER=uttarakhand-heritage

# Firebase Configuration
FIREBASE_PROJECT_ID=project-gi-chatbot-84479
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_FIREBASE_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project-gi-chatbot-84479.iam.gserviceaccount.com

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Environment
NODE_ENV=development`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');
} catch (error) {
  console.log('⚠️ Could not create .env.local (may already exist)');
}

// 2. Initialize database
console.log('📊 Initializing database...');
try {
  execSync('npx tsx lib/init-database.ts', { stdio: 'inherit' });
  console.log('✅ Database initialized');
} catch (error) {
  console.log('⚠️ Database initialization failed, but continuing...');
}

// 3. Initialize Cloudinary folders
console.log('☁️ Initializing Cloudinary folders...');
try {
  execSync('npx tsx lib/init-cloudinary.ts', { stdio: 'inherit' });
  console.log('✅ Cloudinary folders initialized');
} catch (error) {
  console.log('⚠️ Cloudinary initialization failed, but continuing...');
}

console.log('🎉 Complete initialization finished!');
console.log('');
console.log('📝 Next steps:');
console.log('1. Update .env.local with your actual credentials');
console.log('2. Run: npm run dev');
console.log('3. Check MongoDB Compass for new collections');
console.log('4. Check Firebase for new collections');
console.log('5. Check Cloudinary for new folders');
console.log('');
console.log('🔧 If you see any errors, make sure:');
console.log('- MongoDB is running (or use MongoDB Atlas)');
console.log('- Firebase credentials are correct');
console.log('- Cloudinary credentials are correct');
