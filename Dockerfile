FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm i -g pm2

COPY --from=build /app/dist ./dist
COPY ./ecosystem.config.js ./
EXPOSE 3000
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]
