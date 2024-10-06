# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Install npm dependencies
RUN npm install

COPY apps/instalite_be apps/instalite_be
COPY libs libs

# Build the app
RUN npm run build instalite_be

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for production installation
COPY package.json ./ 
COPY package-lock.json ./ 

# Install npm dependencies in production environment
RUN npm install --omit=dev --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/instalite_be/main.js"]
