# Use a Node.js base image (choose a compatible version)
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the backend directory into the container
COPY backend ./backend

# Copy the rest of your application code
COPY . .

# Define the port your app listens on
EXPOSE $PORT

# Start your Node.js server
CMD [ "node", "backend/index.js" ]
