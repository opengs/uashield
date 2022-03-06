#!/bin/sh

sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    wget

wget -O - https://get.docker.com/ | bash

sudo systemctl enable docker.service
sudo systemctl start docker.service

mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
sudo chown $USER /var/run/docker.sock

sudo echo "
version: \"3.3\"
services:
  worker:
    image: ghcr.io/opengs/uashield:latest
    command:
      - \"7500\"
      - \"true\"" >> /home/docker-compose.yaml

sudo apt install -y docker-compose

cd /home/

#get amount of CPU cores
cpu_qty=$(grep -c ^processor /proc/cpuinfo)
#set amount of workers as CPU cores minus one to avoid 100% CPU load, because it can cause account ban
if [ $cpu_qty -gt 1 ] #if only one core nothing to decrease
then
    workers_qty=$(($cpu_qty-1))
else
    workers_qty=$cpu_qty
fi

sudo docker-compose pull && sudo docker-compose up -d --scale worker=$workers_qty

sudo echo "*/30 * * * * cd /home/ && sudo docker-compose down && sudo docker-compose pull && sudo docker-compose up -d --scale worker=$workers_qty" >> /home/cronjob
crontab /home/cronjob
