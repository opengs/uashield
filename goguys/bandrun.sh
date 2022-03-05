docker build -t shieldgo .
docker rm -f kkkk
docker run --rm --name kkkk -e REPEATERSPAWNNEWWORKERSCOUNT=256 -e REPEATSLEEPBEFORE=50 -e REPEATTARGET=true -e ONLYOK=true -e ONLYPROXY=true -e WORKERS=256 -e DISGUISEASBOTPERCENTAGE=0 -e TIMEOUT=500 shieldgo