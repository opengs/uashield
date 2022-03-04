FROM golang:1.17.8-alpine3.15 as builder
WORKDIR /app
COPY main.go /app
COPY go.mod /app
RUN go build -o /boom && chmod +x /boom

FROM golang:1.17.8-alpine3.15 as runner
COPY --from=builder /boom /usr/bin/boom

ENV ONLYOK=false
ENV USEPROXY=true
ENV TIMEOUT=5000
ENV WORKERS=1024
ENTRYPOINT ["boom"]