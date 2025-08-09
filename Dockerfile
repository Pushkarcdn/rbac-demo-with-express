# Use official Node.js image
FROM arm64v8/node:22-alpine

# Set environment variables
ARG WORKDIR
ARG NODE_ENV
ARG INTERNAL_PORT

# Set working directory
WORKDIR $WORKDIR

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Expose the app port
EXPOSE $INTERNAL_PORT

# Run the app
CMD ["npm", "start"]