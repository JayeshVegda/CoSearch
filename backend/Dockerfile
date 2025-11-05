FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set production environment inside the container
ENV NODE_ENV=production
ENV PORT=8484

# Install curl for fetching dotenvx installer
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Install dotenvx for runtime environment variable handling
RUN curl -fsS https://dotenvx.sh | sh

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8484

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8484/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
# Note: dotenvx is installed but not needed in CMD since server.js skips .env loading in production
# and Render provides environment variables directly
CMD ["npm", "start"]