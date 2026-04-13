FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]

