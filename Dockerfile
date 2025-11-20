FROM node:20

WORKDIR /usr/src/app

RUN npm cache clean -f

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install --legacy-peer-deps
RUN npm rebuild bcrypt --build-from-source

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start:prod"]