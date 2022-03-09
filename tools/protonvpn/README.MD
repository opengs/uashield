Run uashield under ProtonVPN.

[Original docs for ProtonVPN in docker](https://tprasadtp.github.io/protonvpn-docker/#/README).

## 1. Change settings in docker-compose.yml 
- `PROTONVPN_USERNAME: - set username from OpenVPN/IKEv2 username account settings in ProtonVPN web interface
- `PROTONVPN_PASSWORD` - set password from OpenVPN/IKEv2 username account settings in ProtonVPN web interface
- `PROTONVPN_SERVER` - set server connect to. You can set `RANDOM` for random server from your plan
- `PROTONVPN_TIER` - Proton VPN Tier (0=Free, 1=Basic, 2=Pro, 3=Visionary)

## 2. Run service

`docker-compose up -d` - if you already have previously built uashield image
`docker-compose up -d --build` - if you want to build an image from scratch

For checking your IP inside uashield container please run `docker exec -ti uashield-protonpvn  wget -qO- https://ipecho.net/plain ;echo`

## 3. Restart service

`docker-compose down -t 15 && docker-compose up -d`

