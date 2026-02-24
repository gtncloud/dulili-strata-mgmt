#!/bin/bash

# Dulili Quick Start
# One command to get everything running

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║         Dulili Quick Start            ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if already running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ App is already running!"
    echo ""
    echo "  Local:  http://localhost:3000"
    echo "  Public: https://dulili-dev.dulili.io"
    echo ""
    echo "Test Credentials:"
    echo "  manager@dulili.com.au / password123"
    echo "  owner@example.com / password123"
    echo ""
    exit 0
fi

# Start everything
./manage-app.sh start

# Show helpful info
echo "═══════════════════════════════════════"
echo ""
echo "Test Credentials:"
echo "  manager@dulili.com.au / password123"
echo "  owner@example.com / password123"
echo ""
echo "Useful Commands:"
echo "  ./manage-app.sh status   - Check status"
echo "  ./manage-app.sh restart  - Restart services"
echo "  ./manage-app.sh stop     - Stop everything"
echo "  ./keep-alive.sh          - Auto-restart monitor"
echo ""
echo "Testing:"
echo "  cd app && npm run test:smoke  - Quick test"
echo "  cd app && npm run test        - Full E2E tests"
echo ""
