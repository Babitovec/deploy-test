FROM node:alpine as build

COPY package.json package-lock.json
RUN npm install
COPY . .

EXPOSE 4444

CMD ["npm", "start"]
