#Use official Node.js image as base
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code to the container
COPY . .

# Expose port 3001  to the outside world
EXPOSE 3000

# Command to run the React app
CMD ["npm", "run", "dev"]
