FROM node:20.14.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY .env .
COPY ./src ./src

RUN npm run build
CMD ["npm", "run", ""]

