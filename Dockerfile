FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn
copy ./sounds ./sounds
COPY . .

CMD [ "npm", "start" ]
