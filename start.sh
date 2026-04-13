#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  StormCloud AI — Local Dev Startup Script
#  Uses Podman (open source Docker alternative)
#  Builds the image, runs the container, opens browser
# ─────────────────────────────────────────────────────────
set -euo pipefail

IMAGE_NAME="stormcloud-ai"
CONTAINER_NAME="stormcloud-ai-local"
PORT=8080
URL="http://localhost:${PORT}"

echo "──────────────────────────────────────"
echo "  StormCloud AI — Local Dev"
echo "──────────────────────────────────────"

# ── Check Podman is installed ──
if ! command -v podman &>/dev/null; then
  echo "❌  Podman is not installed. Run: brew install podman"
  exit 1
fi

# ── Ensure Podman machine is running ──
MACHINE_STATE=$(podman machine inspect --format '{{.State}}' 2>/dev/null || echo "missing")

if [ "${MACHINE_STATE}" = "missing" ]; then
  echo "🔧  No Podman machine found. Initialising..."
  podman machine init
  podman machine start
elif [ "${MACHINE_STATE}" != "running" ]; then
  echo "🐳  Starting Podman machine..."
  podman machine start
else
  echo "✅  Podman machine is running."
fi

# ── Stop & remove existing container if it exists ──
if podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "🛑  Removing existing container..."
  podman rm -f "${CONTAINER_NAME}" &>/dev/null
fi

# ── Build image ──
echo "🔨  Building image: ${IMAGE_NAME}..."
podman build --platform linux/amd64 -t "${IMAGE_NAME}" .

# ── Run container ──
echo "🚀  Starting container on port ${PORT}..."
podman run -d \
  --name "${CONTAINER_NAME}" \
  --platform linux/amd64 \
  -p "${PORT}:80" \
  "${IMAGE_NAME}"

# ── Wait for server to respond ──
echo "⏳  Waiting for server to be ready..."
WAIT=0
until curl -sf "${URL}" &>/dev/null; do
  if [ $WAIT -ge 20 ]; then
    echo "❌  Server did not respond within 20 seconds."
    echo "    Check logs: podman logs ${CONTAINER_NAME}"
    exit 1
  fi
  sleep 1
  WAIT=$((WAIT + 1))
done

# ── Open browser (macOS) ──
echo "🌐  Opening ${URL}..."
open "${URL}"

echo ""
echo "✅  StormCloud AI is running at ${URL}"
echo ""
echo "   Stop:    podman stop ${CONTAINER_NAME}"
echo "   Logs:    podman logs -f ${CONTAINER_NAME}"
echo "   Rebuild: bash start.sh"
echo "──────────────────────────────────────"
