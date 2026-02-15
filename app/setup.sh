#!/bin/bash

# StrataHub Setup Script
# Run this to set up your development environment

set -e  # Exit on error

echo "🚀 StrataHub Setup Script"
echo "========================="
echo ""

# Check if we're in the app directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the app/ directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
echo "This may take a few minutes..."
echo ""

# Remove old SQLite dependencies
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3 @types/better-sqlite3 2>/dev/null || true

# Install core dependencies
npm install @prisma/client@latest prisma@latest

# Install tRPC stack
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query@latest
npm install zod superjson

# Install Supabase
npm install @supabase/supabase-js

# Install Better-Auth
npm install better-auth

# Install email
npm install resend react-email @react-email/components

# Install UI enhancements
npm install sonner react-dropzone cmdk framer-motion

# Install dev dependencies
npm install -D @types/node@latest

echo "✅ Dependencies installed"
echo ""

echo "🗄️  Step 2: Setting up database..."
echo ""

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run migration
echo "Running database migration..."
npx prisma migrate dev --name init

echo "✅ Database setup complete"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000"
echo "3. Optional: Run 'npx prisma db seed' to add test data"
echo ""
echo "📚 For detailed instructions, see SETUP-INSTRUCTIONS.md"
echo ""
