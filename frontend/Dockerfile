FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY server.js .
COPY public/ ./public/

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
