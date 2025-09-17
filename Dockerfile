# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies including bash (needed for the script)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    bash

# Copy package.json first
COPY package.json ./

# Install main dependencies
RUN npm install --silent

# Copy all application files
COPY . .

# Install extension dependencies and build extensions
RUN cd src-extensions/my-bundle && \
    npm install --silent && \
    npm run build

# Create extensions directory structure and copy built extension
RUN mkdir -p extensions/directus-extension-my-bundle uploads && \
    cp -r src-extensions/my-bundle/dist extensions/directus-extension-my-bundle/ && \
    cp src-extensions/my-bundle/package.json extensions/directus-extension-my-bundle/

# Clean up dev dependencies from main app (keep extension deps for runtime)
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S directus -u 1001 && \
    chown -R directus:nodejs /app

# Switch to non-root user
USER directus

# Expose the port that Cloud Run expects
EXPOSE 8080

# Set environment variables for Cloud Run
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV DB_CLIENT=sqlite3
ENV DB_FILENAME=/app/data.db

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/server/health || exit 1

# Start the application
CMD ["npm", "start"]