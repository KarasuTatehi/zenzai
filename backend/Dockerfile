FROM node:14
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
   && apt-get -y install --no-install-recommends ffmpeg \
   && apt-get autoremove -y \
   && apt-get clean -y \
   && rm -rf /var/lib/apt/lists/*

COPY . /app/
RUN yarn install

EXPOSE 2345
CMD node app.js
