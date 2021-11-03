FROM mhart/alpine-node:latest AS image-build

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN apk add --update --no-cache git

COPY . .

RUN yarn install && yarn clean && yarn build

FROM mhart/alpine-node:latest AS image-run
WORKDIR /opt/app
COPY --from=image-build ./opt/app/dist ./dist
COPY package.json yarn.lock ./

RUN NODE_ENV=production yarn install --production --ignore-optional && \
  yarn autoclean --init && \
  yarn autoclean --force && \
  yarn cache clean

EXPOSE 3232

CMD yarn start