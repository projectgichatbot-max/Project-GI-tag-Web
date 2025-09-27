const fs = require('fs');
const path = require('path');

// Create .env.local file
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

// Write .env.local file
fs.writeFileSync('.env.local', envContent);
console.log('✅ Created .env.local file');

// Create missing API routes
const missingRoutes = [
  'app/api/artisans/[id]/route.ts',
  'app/api/contact/route.ts',
  'app/api/upload/route.ts'
];

missingRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), route);
  const routeDir = path.dirname(routePath);
  
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  if (!fs.existsSync(routePath)) {
    console.log(`⚠️ Missing route: ${route}`);
  }
});

console.log('🔧 Setup script completed. Please update .env.local with your actual credentials.');
