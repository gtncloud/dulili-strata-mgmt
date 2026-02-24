#!/bin/bash

echo "🚀 Starting Dulili Cloudflare Tunnel..."
echo ""
echo "Your app will be available at:"
echo "  https://dulili-dev.dulili.io"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo ""

cloudflared tunnel --config .cloudflared/config.yml run dulili-dev
