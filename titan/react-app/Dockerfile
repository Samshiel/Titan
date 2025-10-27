# Frontend Dockerfile for React application
FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]

