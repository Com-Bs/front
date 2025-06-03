# Reference used: https://medium.com/@itsuki.enjoy/dockerize-a-next-js-app-4b03021e084d
# Decided to exclude the docker compose suggestion as it is not needed since the container is spun up by cloud init script.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]