FROM node:18.17.1

WORKDIR /main/server

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
