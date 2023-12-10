FROM node:alpine
EXPOSE 3000

# Set the working directory to /usr/app
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies and typescript
RUN npm install && npm install typescript -g && npm install typeorm -g --save

# Copy the rest of the files to the working directory
COPY . .

# Start the node server
ENTRYPOINT ["npm", "run", "migrate-and-start"]
