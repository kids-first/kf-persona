FROM node:16.10.0-alpine AS image-build

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . .

RUN yarn install && yarn clean && yarn build

FROM node:16.10.0-alpine AS image-run
WORKDIR /opt/app
COPY --from=image-build ./opt/app/dist ./dist
COPY package.json yarn.lock ./

RUN NODE_ENV=production yarn install --production --ignore-optional && \
  yarn autoclean --init && \
  yarn autoclean --force && \
  yarn cache clean

EXPOSE 3232

CMD yarn start