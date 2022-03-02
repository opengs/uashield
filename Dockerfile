FROM node:14-alpine 

RUN mkdir -p /code
WORKDIR /code

COPY yarn.lock /code/
COPY packageheadless.json /code/package.json
RUN yarn install 
COPY . /code/
RUN yarn build:headless

ENTRYPOINT ["yarn", "start:headless"]

