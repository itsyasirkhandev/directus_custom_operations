# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S directus -u 1001

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy application files
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p /app/uploads /app/extensions && \
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