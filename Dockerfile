FROM node:22-alpine

WORKDIR /app

# Install git (if needed for packages) + bash (for scripts)
RUN apk add --no-cache bash git

# Copy package files
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src
COPY ./nodemon.json ./

# Expose port
EXPOSE 3000

# Run in dev mode with nodemon
CMD ["npx", "nodemon", "src/server.js"]