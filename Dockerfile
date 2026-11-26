FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev


FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/server server
COPY --from=build /app/client/dist client/dist

USER node
EXPOSE 3000
CMD ["node", "server/src/index.js"]
