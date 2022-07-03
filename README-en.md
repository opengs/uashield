# UA Cyber SHIELD

*CAUTION! We do not support unlawful attacks or malware campaigns that cause technical harm. We provide you with a tool which you can use, but we are not telling or advising you on what to do with it. YOU are responsible of what you choose to do with it !!!! We are just providing a tool JUST LIKE thousand others on Github. If we give you a hammer - YOU are responsible of what you choose to knock with it !*

*Дивись цю сторінку [українською](README.md)*

[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

## For cyber defenders

1. You can find binaries on [releases page](https://github.com/opengs/uashield/releases)
2. Find the [latest release](https://github.com/opengs/uashield/releases/latest) and your platform
3. Download and run the binary file

**Running on Linux may require an additional `--no-sandbox` argument. Windows doesn't require any additional arguments to run.**

## How it works

Our volunteer defense center does all the hard work: monitoring targets, running technical infrastructure, coordinating attack targets, syncronizing it with client applications, etc.
When an attack is performed, the application gets the data it needs automatically.
The only thing you need to do is to install and run it.
Targets being attacked are changed automatically and are downloaded from the control center/server.

## Program interface

![A working example](docs/working.png)

## Run from source code

1. Clone the repo: `git clone https://github.com/opengs/uashield.git`
2. Install dependencies: `cd uashield && npm install`
3. Run build: `npm run build:electron`
4. Run the binary from `./dist/electron` or electron version: `npm run start:electron`

## Headless version (Docker)

1. Build an image: `docker build . -t uashield`
2. Run: `docker run uashield --workers=512 --withProxy=true` - where --workers=`512` - threads count, and --withProxy=`true` | `false` whether you want to use proxies

Complete command help: `docker run uashield --help`

Or use [pre-built image](https://github.com/opengs/uashield/pkgs/container/uashield):

```bash
docker run ghcr.io/opengs/uashield:master --workers=512 --withProxy=true
```

## Docker-compose version

1. Run: `docker-compose up -d`
2. Edit variables `WORKERS` and `USEPROXY` in file `docker-compose.yml` - where `256` - threads count, and `true` | `false` whether you want to use proxies

## Deploy on Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Deploy with Ansible

[tools/ansible/README.md](tools/ansible/README.md)

## Deploy on Kubernetes

[tools/helm/README.md](tools/helm/README.md)

## Deploy with Play With Docker - free instance for 4 hours

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/master/pwd-docker-compose.yml)

## Donations
Donations will be used exclusively to fund our operations:
1. Expenses on constantly buying new proxy servers
2. Occasionally buying servers for IT infastructure

When we win the war and there is peace in Ukraine, funds left will be transferred to charity funds to help casualties of the war.

You can help us through:
- BTC: bc1q7e6ew74x56vdpsev5ycqq8ke3tk4yv5452l25g
- ETH: 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F
- USDT (ETH): 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F **this is address on ETH network**

Also, you can treat developers with some coffee so they can continue to skip work and keep investing time in the project all night long:
- BTC: bc1q7g5s3c89lymc9vtrf0y8tqyx4mg0hefeyr6zsv
- ETH: 0x75A291AB6795f747177975bac250B47A33ee54Ed
- USDT (ETH): 0x75A291AB6795f747177975bac250B47A33ee54Ed **this is address on ETH network**

We will add more options in future :)
