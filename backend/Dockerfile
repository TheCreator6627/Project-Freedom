
FROM node:20-alpine

WORKDIR /app

# Kopiere nur package.json, um den Cache zu nutzen
COPY package*.json ./

# Installiere NUR Production-Dependencies
RUN npm install --omit=dev

# Kopiere den restlichen Code (server.js, utils/, db/, etc.)
COPY . .

# Erstelle einen unprivilegierten Benutzer
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 node
USER node

# Dein Code nutzt Port 5000 als Fallback, aber wir setzen den Port via Docker auf 8080
EXPOSE 8080

# Starte die Anwendung
CMD [ "node", "server.js" ]