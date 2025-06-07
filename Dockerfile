
# Stage 1: Build the React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build arguments for environment variables
ARG VITE_RETELL_API_KEY
ARG VITE_RETELL_BASE_URL

# Set environment variables for build
ENV VITE_RETELL_API_KEY=$VITE_RETELL_API_KEY
ENV VITE_RETELL_BASE_URL=$VITE_RETELL_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Install bash and curl for Coolify terminal access and health checks
RUN apk update && apk add --no-cache bash curl

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html

# Create custom nginx configuration for SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
