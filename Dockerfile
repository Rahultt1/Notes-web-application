# Use a Node.js base image (choose a compatible version)
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your React app (assuming you use `npm run build`)
RUN npm run build

# Define the port your app listens on
EXPOSE 3000

# Start your Node.js server
CMD [ "npm", "start" ]
