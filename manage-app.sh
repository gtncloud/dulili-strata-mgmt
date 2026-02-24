#!/bin/bash

# Dulili App Management Script
# Manages dev server and Cloudflare tunnel

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"
TUNNEL_CONFIG="$SCRIPT_DIR/.cloudflared/config.yml"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_dev_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

check_tunnel() {
    # Check if cloudflared process is running
    if pgrep -f "cloudflared tunnel" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

start_dev_server() {
    print_status "Starting dev server..."
    cd "$APP_DIR"
    npm run dev > /dev/null 2>&1 &
    DEV_PID=$!
    echo $DEV_PID > "$SCRIPT_DIR/.dev-server.pid"
    
    # Wait for server to be ready
    echo -n "Waiting for dev server to start"
    for i in {1..30}; do
        if check_dev_server; then
            echo ""
            print_status "Dev server ready at http://localhost:3000"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    echo ""
    print_error "Dev server failed to start"
    return 1
}

start_tunnel() {
    print_status "Starting Cloudflare tunnel..."
    cd "$SCRIPT_DIR"
    cloudflared tunnel --config "$TUNNEL_CONFIG" run dulili-dev > /dev/null 2>&1 &
    TUNNEL_PID=$!
    echo $TUNNEL_PID > "$SCRIPT_DIR/.tunnel.pid"
    
    # Wait for tunnel to be ready
    sleep 3
    if check_tunnel; then
        print_status "Tunnel ready at https://dulili-dev.dulili.io"
        return 0
    else
        print_warning "Tunnel may still be connecting..."
        return 0
    fi
}

stop_dev_server() {
    if [ -f "$SCRIPT_DIR/.dev-server.pid" ]; then
        PID=$(cat "$SCRIPT_DIR/.dev-server.pid")
        if ps -p $PID > /dev/null 2>&1; then
            print_status "Stopping dev server (PID: $PID)..."
            kill $PID 2>/dev/null || true
            rm "$SCRIPT_DIR/.dev-server.pid"
        fi
    fi
    
    # Also kill any npm/node processes on port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
}

stop_tunnel() {
    if [ -f "$SCRIPT_DIR/.tunnel.pid" ]; then
        PID=$(cat "$SCRIPT_DIR/.tunnel.pid")
        if ps -p $PID > /dev/null 2>&1; then
            print_status "Stopping tunnel (PID: $PID)..."
            kill $PID 2>/dev/null || true
            rm "$SCRIPT_DIR/.tunnel.pid"
        fi
    fi
    
    # Also kill any cloudflared processes
    pkill -f "cloudflared tunnel" 2>/dev/null || true
}

status() {
    echo ""
    echo "=== Dulili App Status ==="
    echo ""
    
    # Check dev server
    if check_dev_server; then
        print_status "Dev Server: Running at http://localhost:3000"
    else
        print_error "Dev Server: Not running"
    fi
    
    # Check tunnel
    if check_tunnel; then
        print_status "Tunnel: Connected at https://dulili-dev.dulili.io"
    else
        print_error "Tunnel: Not connected"
    fi
    
    echo ""
}

start() {
    echo ""
    echo "=== Starting Dulili App ==="
    echo ""
    
    # Stop any existing processes
    stop_dev_server
    stop_tunnel
    
    # Start dev server
    start_dev_server
    
    # Start tunnel
    start_tunnel
    
    echo ""
    print_status "Dulili is now running!"
    echo ""
    echo "  Local:  http://localhost:3000"
    echo "  Public: https://dulili-dev.dulili.io"
    echo ""
    echo "Run './manage-app.sh status' to check status"
    echo "Run './manage-app.sh stop' to stop all services"
    echo "Run './manage-app.sh restart' to restart"
    echo ""
}

stop() {
    echo ""
    echo "=== Stopping Dulili App ==="
    echo ""
    
    stop_dev_server
    stop_tunnel
    
    print_status "All services stopped"
    echo ""
}

restart() {
    stop
    sleep 2
    start
}

logs() {
    echo ""
    echo "=== Dulili App Logs ==="
    echo ""
    echo "Press Ctrl+C to exit"
    echo ""
    
    # Show logs from both processes
    tail -f "$APP_DIR/.next/trace" 2>/dev/null || echo "No dev server logs available"
}

case "${1:-}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    *)
        echo "Dulili App Management"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start dev server and tunnel"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  status  - Check if services are running"
        echo "  logs    - View application logs"
        echo ""
        exit 1
        ;;
esac
