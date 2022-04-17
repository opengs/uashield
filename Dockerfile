FROM node:16-alpine AS builder
WORKDIR /code

COPY .yarnrc ./.yarnrc
COPY packageheadless.json ./package.json
# no need to --frozen-lockfile
# from docs - If yarn.lock is present and is enough to satisfy all the dependencies listed in package.json,
# the exact versions recorded in yarn.lock are installed, and yarn.lock will be unchanged.
# Yarn will not check for newer versions.
RUN yarn install

COPY . .
COPY tsconfig.headless.json ./tsconfig.json

RUN yarn build:headless


# Optimizes the build, so no NODE_MODULES included in image. Don't remove this
FROM node:16-alpine

WORKDIR /code

COPY packageheadless.json ./package.json
COPY --from=builder /code/build/headless/ ./build/headless/

ENTRYPOINT ["yarn", "start:headless"]

