FROM node:19-alpine3.16
EXPOSE 44044
WORKDIR /app
COPY package*.json ./
COPY lab.js ./
RUN npm install express pug twig ejs
CMD ["node", "lab.js"]