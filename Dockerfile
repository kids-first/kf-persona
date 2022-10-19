FROM node:18.10.0-alpine3.15 AS build-image

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN apk add --update --no-cache

COPY . .

RUN npm install && npm run clean && npm run build

FROM node:18.10.0-alpine3.15 AS image-run
WORKDIR /opt/app
COPY --from=build-image ./opt/app/dist ./dist
COPY package* ./

RUN NODE_ENV=production npm install --production --ignore-optional && \
  npm prune

EXPOSE 3232

CMD npm start