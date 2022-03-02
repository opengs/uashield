FROM node:14-alpine 

RUN mkdir -p /code
WORKDIR /code

ENTRYPOINT ["yarn", "start:headless"]