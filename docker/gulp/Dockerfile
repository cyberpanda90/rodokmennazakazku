FROM node:18
WORKDIR "/application"

COPY docker/gulp/package*.json ./
COPY docker/gulp/gulpfile.js ./
RUN npm install -g gulp-cli
RUN npm install

EXPOSE 3000
