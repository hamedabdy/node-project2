FROM node:22-alpine AS base

# Arguments and environment
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies needed for the build (bash, git, etc.)
RUN apk add --no-cache bash git

# Create non-root user 'app'
# RUN addgroup app && adduser -S -G app app

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json first
COPY --chown=node:node ./package*.json ./

# Ensure app directory is owned by the non-root user
RUN chown -R node:node /app

# Switch to non-root user to install dependencies
USER node

# Install dependencies
RUN npm install

COPY --chown=node:node ./src ./src
COPY --chown=node:node ./nodemon.json ./

# Expose port
EXPOSE 3000

FROM base AS development
# Run in dev mode with nodemon
# ENTRYPOINT logic based on NODE_ENV
CMD ["npx", "nodemon", "src/server.js"]

FROM base AS production
CMD ["node", "src/server.js"]