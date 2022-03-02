FROM node:16.9.0-alpine AS builder
WORKDIR /code

COPY yarn.lock .
COPY packageheadless.json ./package.json
RUN yarn --frozen-lockfile

COPY . .
COPY tsconfig.headless.json ./tsconfig.json

RUN yarn build:headless

FROM node:14-alpine

WORKDIR /code

COPY packageheadless.json ./package.json
COPY --from=builder /code/build/headless/ ./build/headless/

ENTRYPOINT ["yarn", "start:headless"]

