FROM node:22-alpine as build
WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install --legacy-peer-deps
COPY . /app
EXPOSE 3000
CMD [ "npm", "run", "dev"]