#!/bin/sh

cd /root/uashield/

if git checkout master &&
    git fetch origin master &&
    [ `git rev-list HEAD...origin/master --count` != 0 ] &&
    git merge origin/master
then
    echo 'Updated!'
    sudo chmod +x /root/uashield/tools/ansible/update-build.sh
    sudo docker-compose down -t 1
    sudo docker rmi -f uashield
    sudo docker-compose up -d
    docker ps
else
    echo 'Not updated.'
fi