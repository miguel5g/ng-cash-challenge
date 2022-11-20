FROM node:16-alpine

WORKDIR /usr/src/app/

COPY *.json ./

COPY .swcrc .

COPY src ./src

COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY seed.mjs .

COPY database-test-connection.mjs .

RUN npm run build

EXPOSE 1234

CMD [ "npm", "start" ]