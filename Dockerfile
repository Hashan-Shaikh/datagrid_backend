# Use an official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . ./

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]
