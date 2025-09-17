#!/bin/bash

# 🚀 Quick Deployment Script for Postman Docs Generator

echo "🚀 Preparing Postman Documentation Generator for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build to test
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel: npx vercel"
    echo "2. Or push to GitHub and connect to Vercel"
    echo "3. Share the deployed URL with your beta testers"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
