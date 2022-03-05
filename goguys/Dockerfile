FROM golang:1.17.8-alpine3.15 as builder
WORKDIR /app
COPY main.go /app
COPY go.mod /app
RUN go build -o /repeater && chmod +x /repeater

FROM golang:1.17.8-alpine3.15 as runner
COPY --from=builder /repeater /usr/bin/repeater
COPY resources /resources
WORKDIR /

ENV ONLYOK=false
ENV USEPROXY=true
ENV TIMEOUT=5000
ENV WORKERS=1024
ENV REPEATTARGET=true
ENV DISGUISEASBOTPERCENTAGE=1
ENTRYPOINT ["repeater"]