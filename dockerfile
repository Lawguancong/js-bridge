FROM node:15.14.0-slim

WORKDIR /drone/
COPY ./package.json /drone/
COPY ./yarn.lock /drone/

RUN yarn config set registry https://registry.npmmirror.com/
RUN yarn install
