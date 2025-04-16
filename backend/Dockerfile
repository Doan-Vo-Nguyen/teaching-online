FROM node:22-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment file
COPY .env ./

# Expose port
EXPOSE 3004

# Start production server
CMD ["npm", "run", "production"] 