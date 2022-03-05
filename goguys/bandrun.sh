docker build -t shieldgo .
docker rm -f kkkk
docker run --rm --name kkkk -e REPEATTARGET=true -e ONLYOK=false -e ONLYPROXY=true -e WORKERS=1024 -e DISGUISEASBOTPERCENTAGE=0 -e TIMEOUT=4000 shieldgo