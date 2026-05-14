#!/usr/bin/env bash
set -euo pipefail

# Linux system deps for React Native DevTools in Expo (Codespaces/Ubuntu).
if [[ "$(uname -s)" == "Linux" ]]; then
  sudo apt-get update
  sudo apt-get install -y \
    libatk1.0-0t64 \
    libatk-bridge2.0-0t64 \
    libcups2t64 \
    libgtk-3-0t64 \
    libgbm1 \
    libasound2t64
fi

npm install
