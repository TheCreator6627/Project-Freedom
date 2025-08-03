# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 node
USER node

EXPOSE 8080
CMD [ "node", "server.js" ]