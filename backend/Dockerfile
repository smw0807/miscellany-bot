FROM node:21

WORKDIR /app
COPY package*.json ./

RUN npm i -g @nestjs/cli
#RUN npm ci --omit=dev
RUN npm ci

COPY . .


ARG NODE_ENV
ENV NODE_ENV=production

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
