# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code and build the app
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the build output to the production container
COPY --from=build /app/dist /app/dist

# Expose the port where the app will run
EXPOSE 5173

# Run the serve command to serve the app on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

