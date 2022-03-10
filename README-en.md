# UA Cyber SHIELD

*ALERT!!! We not supporting unlawful active attacks or malware campaigns that are causing technical harm. Use only for educational purposes. You can only try this platform on your own website!*

*Дивись цю сторінку [українською](README.md)*

[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

**The volunteer cyber defense system of Ukraine**

- Community: [Discord](https://discord.gg/7BfJ9JKQ98) [Telegram](https://t.me/uashield)
- Video Instruction [in Ukrainian](https://youtu.be/snTzpRt7a5k)

## For cyber defenders

1. You can find binaries on [releases page](https://github.com/opengs/uashield/releases)
2. Find the [latest release](https://github.com/opengs/uashield/releases/latest) and your platform
3. Download and run the binary file

**Running on Linux may require an additional `--no-sandbox` argument. It doesn't affect Windows**

## How it works

Our volunteer defense center does all the hard work: monitoring the targets, running the technical infrastructure, coordinating the attack targets, coordinating with the client applications, etc.
When the attack is performed, the application gets the data that it needs automatically.
The only thing you need to do is to install it.
Targets being attacked are changed automatically and are downloaded from the control center/server.

## Program interface

![A working example](docs/working.png)

## How to build from source code

1. Clone the repo: `git clone https://github.com/opengs/uashield.git`
2. Install dependencies: `cd uashield && npm install`
3. Run build: `npm run build:electron`
4. Run the binary from `./dist/electron` or electron version: `npm run start:electron`

## Headless version (Docker)

1. Build an image: `docker build . -t uashield`
2. Run: `docker run uashield 512 true` - where `512` - threads count, and `true` | `false` if you want to use a proxy or not

Or use [pre-built image](https://github.com/opengs/uashield/pkgs/container/uashield):

```bash
docker run -d ghcr.io/opengs/uashield:master 512 true
```

## Docker-compose version

1. Run: `docker-compose up -d`
2. Edit variables `WORKERS` and `USEPROXY` in file `docker-compose.yml` - where `256` - threads count, and `true` | `false` if you want to use a proxy or not

## Deploy on Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Deploy with Ansible

[tools/ansible/README.md](tools/ansible/README.md)

## Deploy to Kubernetes

[tools/helm/README.md](tools/helm/README.md)

## Deploy with Play With Docker - free instance for 4 hours

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/master/pwd-docker-compose.yml)

## Donations
Donations will be used exclusively to fund our operations:
1. Expenses on constantly buying new proxy servers
2. From time to time buying servers for new infastructure

When we win the war and there is peace in Ukraine, funds will be transfered to voluntary associations to help victims of this war.

You can help us using:
- BTC: 11wxDarouPfY6P3misLvFuJ8k8oWhd4qb

Also, here are some variants if you want to help developers with some coffee, so we can continue to skip work and keep investing time in the project all nights:
- BTC: 12CcLYn6zrBcnmvK5fRSAQcJre5jknyTxH

We will add more variants in future :)
