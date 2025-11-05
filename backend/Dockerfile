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

# Install dotenvx and strip .env files from the final image
RUN curl -fsS https://dotenvx.sh | sh
RUN dotenvx ext prebuild

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8484

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8484/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application via dotenvx runner (still uses environment variables, not .env)
CMD ["dotenvx", "run", "--", "npm", "start"]