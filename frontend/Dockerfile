FROM node:14
WORKDIR /app

RUN apt-get update

COPY . /app/
RUN npm install

EXPOSE 2345
CMD npm run dev
