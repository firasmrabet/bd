FROM node:20-slim

# Install necessary system deps for Chromium/Puppeteer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        fonts-liberation \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libatspi2.0-0 \
        libc6 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libgcc1 \
        libglib2.0-0 \
        libnspr4 \
        libnss3 \
        libx11-6 \
        libx11-xcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        wget \
        gnupg \
        --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Chromium
RUN apt-get update && apt-get install -y --no-install-recommends chromium && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

WORKDIR /app

# Copy package manifests first for cached install
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund

# Copy app source
COPY . ./

EXPOSE 5000

CMD ["node", "server.js"]
