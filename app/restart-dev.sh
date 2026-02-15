#!/bin/bash

# StrataHub - Restart Development Server
# Use this when you get Prisma Client errors

echo "🔄 Restarting development server..."
echo ""

# Kill any running Next.js processes
echo "1. Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
echo "2. Clearing Next.js cache..."
rm -rf .next

# Generate Prisma Client
echo "3. Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Ready to start!"
echo ""
echo "Now run: npm run dev"
echo ""
