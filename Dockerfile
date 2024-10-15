# Use the official Node.js image from DockerHub as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables
# ENV PORT=4000
# ENV MONGODB_URI=mongodb://127.0.0.1:27017

# Expose the port your app runs on (using the PORT environment variable)
EXPOSE 4000

# Define the command to run your app
CMD ["npm", "start"]