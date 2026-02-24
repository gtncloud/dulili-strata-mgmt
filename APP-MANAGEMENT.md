# Dulili App Management Guide

## Quick Status Check

Your app is currently running at:
- **Local**: http://localhost:3000
- **Public**: https://dulili-dev.dulili.io

## Management Commands

### Check Status
```bash
./manage-app.sh status
```

### Start Everything
```bash
./manage-app.sh start
```

### Stop Everything
```bash
./manage-app.sh stop
```

### Restart Everything
```bash
./manage-app.sh restart
```

### View Logs
```bash
./manage-app.sh logs
```

## Keep-Alive Monitor

To ensure the app stays running automatically:

```bash
# Run in a separate terminal
./keep-alive.sh
```

This will:
- Check services every 30 seconds
- Auto-restart if dev server goes down
- Auto-restart if tunnel disconnects
- Log all restart events

## Manual Control

### Dev Server Only
```bash
# Start
cd app && npm run dev

# Stop
pkill -f "next dev"
# or
lsof -ti:3000 | xargs kill -9
```

### Tunnel Only
```bash
# Start
cloudflared tunnel --config .cloudflared/config.yml run dulili-dev

# Stop
pkill -f "cloudflared tunnel"
```

## Background Processes

Both services are currently running as background processes:
- Process 3: Cloudflare tunnel
- Process 4: Dev server

You can check them anytime with the status command.

## Test Credentials

- **Manager**: manager@dulili.com.au / password123
- **Owner**: owner@example.com / password123

## Running Tests

```bash
cd app

# Quick smoke test (29 pages)
npm run test:smoke

# Full E2E tests
npm run test

# Visual regression with Percy
npm run test:visual

# Specific test suites
npm run test -- tests/fire-safety.spec.ts
npm run test -- tests/debt-recovery.spec.ts
```

## Troubleshooting

### App Not Loading
```bash
./manage-app.sh restart
```

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
./manage-app.sh start
```

### Tunnel Not Connecting
```bash
# Check tunnel status
cloudflared tunnel info dulili-dev

# Restart tunnel
pkill -f "cloudflared tunnel"
./manage-app.sh start
```

### Database Issues
```bash
cd app
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Production Deployment

For production, consider:

1. **System Service** (macOS LaunchAgent)
2. **PM2** for Node.js process management
3. **Docker** containers for isolation
4. **Cloudflare Tunnel as service** for persistent connection

## Support

- Documentation: See all `*.md` files in root
- Testing Guide: `TESTING-QUICK-START.md`
- Feature Status: `FEATURE-COMPLETION-STATUS.md`
- Compliance: `FIRE-SAFETY-DEBT-RECOVERY-COMPLETE.md`
