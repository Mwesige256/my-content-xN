#!/bin/bash

# Build script for GitHub Pages deployment
echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building web app..."
npm run web -- --build-type web

echo "✅ Build complete! Output in dist/ folder"
echo "📤 Ready for GitHub Pages deployment"
