# Use a lightweight Node.js image to build the React app
FROM node:18-alpine as build

# Set build arguments for React environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL

# Make these available inside React
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all frontend files into the container
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the built React files from the previous step into the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for serving the frontend
EXPOSE 80

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
