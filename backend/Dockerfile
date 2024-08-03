FROM node:21

WORKDIR /app
ADD . /app/

RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 5001

CMD ["npm", "start"]