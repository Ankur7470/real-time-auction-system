# # Build stage: Compile the frontend assets
# FROM node:22-alpine as build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production stage: Serve the built assets via Nginx
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Instead of building first and copying static files...
FROM node:22-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve the built app
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
