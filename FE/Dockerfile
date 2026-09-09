# Stage 1: Build the Angular app
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (optimize layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the Angular app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built Angular app to Nginx's default document root
COPY --from=build /app/dist/angular-course /usr/share/nginx/html

# Copy a custom Nginx configuration file (if required for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
