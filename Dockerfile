FROM node:14-alpine 

RUN mkdir -p /code
WORKDIR /code

COPY package.json yarn.lock /code/
RUN yarn install 
COPY . /code/
RUN yarn build:headless

ENTRYPOINT ["yarn", "start:headless"]

