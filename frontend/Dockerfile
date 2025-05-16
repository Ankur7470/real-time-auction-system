FROM node:22-alpine as build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install --legacy-peer-deps

# Bundle app source
COPY . /app

EXPOSE 3000
CMD [ "npm", "run", "dev"]