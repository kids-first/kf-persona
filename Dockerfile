FROM node:16.13-alpine AS build-image

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN apk add --update --no-cache git

COPY . .

RUN npm install && npm clean && npm build

FROM node:16.13-alpine AS image-run
WORKDIR /opt/app
COPY --from=image-build ./opt/app/dist ./dist
COPY package* ./

RUN NODE_ENV=production npm install --production --ignore-optional && \
  npm autoclean --init && \
  npm autoclean --force && \
  npm cache clean

EXPOSE 3232

CMD npm start