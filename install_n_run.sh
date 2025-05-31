#!/bin/bash

set -e

# Navigate to backend and install dependencies
cd ./backend
npm install bun -g
bun install

# Navigate to frontend and install dependencies
cd ../frontend
npm install

# Go back to project root, install pm2 globally, and start with ecosystem config
cd ../
npm install pm2 -g
pm2 start ecosystem.config.js