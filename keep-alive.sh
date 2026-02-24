#!/bin/bash

# Dulili Keep-Alive Monitor
# Automatically restarts services if they go down

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK_INTERVAL=30  # Check every 30 seconds

echo "Starting Dulili keep-alive monitor..."
echo "Checking services every ${CHECK_INTERVAL} seconds"
echo "Press Ctrl+C to stop"
echo ""

check_and_restart() {
    # Check dev server
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "[$(date)] Dev server is down - restarting..."
        cd "$SCRIPT_DIR/app"
        pkill -f "next dev" 2>/dev/null || true
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
        npm run dev > /dev/null 2>&1 &
        echo "[$(date)] Dev server restarted"
    fi
    
    # Check tunnel
    if ! pgrep -f "cloudflared tunnel" > /dev/null 2>&1; then
        echo "[$(date)] Tunnel is down - restarting..."
        cd "$SCRIPT_DIR"
        cloudflared tunnel --config .cloudflared/config.yml run dulili-dev > /dev/null 2>&1 &
        echo "[$(date)] Tunnel restarted"
    fi
}

# Initial check
check_and_restart

# Monitor loop
while true; do
    sleep $CHECK_INTERVAL
    check_and_restart
done
