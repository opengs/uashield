FROM golang:1.17.8-alpine3.15 as builder
WORKDIR /app
COPY main.go /app
COPY go.mod /app
RUN go build -o /repeater && chmod +x /repeater

FROM golang:1.17.8-alpine3.15 as runner
COPY --from=builder /repeater /usr/bin/repeater
COPY resources /resources
WORKDIR /

ENV ONLYOK=true
ENV USEPROXY=true
ENV TIMEOUT=5000
ENV WORKERS=128
ENV REPEATTARGET=true
ENV DISGUISEASBOTPERCENTAGE=1
ENV REPEATERSPAWNNEWWORKERS=true
ENV REPEATERSPAWNNEWWORKERSCOUNT=512
ENV REPEATSLEEPBEFORE=50
ENV MAXREPEATING=10240
ENV TARGETONLY200=false
ENTRYPOINT ["repeater"]