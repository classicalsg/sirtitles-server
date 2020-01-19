FROM node:13.6.0-alpine

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY src/ .

CMD yarn start
