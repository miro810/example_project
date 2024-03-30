FROM node:18.17.1

WORKDIR /main/client

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
