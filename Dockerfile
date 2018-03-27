FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "npm", "start" ]
