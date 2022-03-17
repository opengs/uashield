FROM mcr.microsoft.com/playwright:v1.20.0-focal
WORKDIR /code

COPY uasword/* .
RUN npm install

ENV SKIP_DDOSER_LISTS=true

ENTRYPOINT ["node", "node_modules/uasword"]
