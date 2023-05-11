FROM node:14-buster-slim

RUN apt-get update

ENV APP_ROOT /src

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN rm -rf node_modules package-lock.json dist
RUN npm install yarn
RUN yarn install
RUN yarn generate
RUN yarn build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0

ENV NUXT_PORT=3000

CMD [ "npm", "start" ]
