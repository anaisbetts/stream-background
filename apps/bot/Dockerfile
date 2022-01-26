FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm rebuild

COPY . .
CMD ["npm", "start"]