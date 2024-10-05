# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Install build tools for native modules (like bcrypt)
RUN apk add --no-cache python3 make g++ 

# Copy package.json and package-lock.json for dependency installation
COPY package.json ./
COPY package-lock.json ./

# Install npm dependencies in development environment
# Rebuild bcrypt from source to ensure compatibility with Alpine
RUN npm install bcrypt --build-from-source && npm install

COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install build tools for native modules in production environment
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json for production installation
COPY package.json ./ 
COPY package-lock.json ./ 

# Install npm dependencies in production environment
# Rebuild bcrypt from source to ensure compatibility with Alpine
RUN npm install bcrypt --build-from-source && npm install --omit=dev --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/instalite_be/main.js"]
