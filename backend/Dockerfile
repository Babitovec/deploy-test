FROM node:20.16.0-alpine as build

RUN npm install -g npm@latest

RUN npm cache clean --force

# Устанавливаем curl
RUN apk add --no-cache curl

COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 4444

CMD ["npm", "start"]
