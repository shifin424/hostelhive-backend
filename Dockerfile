FROM node:18.16-alpine 

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5000 

CMD ["node", "app.js"]



