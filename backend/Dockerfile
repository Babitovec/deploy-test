FROM node:20.16.0-alpine as build

RUN npm cache clean --force

COPY package.json package-lock.json
RUN npm install
COPY . .

EXPOSE 4444

CMD ["npm", "start"]
