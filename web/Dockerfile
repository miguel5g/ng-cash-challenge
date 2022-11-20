FROM node:16-alpine

WORKDIR /usr/src/app

COPY *.json ./

COPY *.config.js ./

COPY src ./src

RUN npm install

ENV NEXT_PUBLIC_BASE_API_URL=http://localhost:1234

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]