# UA Cyber SHIELD

*Дивись цю сторінку [українською](README.md)*

[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

**The voluntary Ukrainian cyber defense system**

- Community: [Discord](https://discord.gg/7BfJ9JKQ98)
- Video Instruction [in Ukrainian](https://youtu.be/snTzpRt7a5k)

## For cyber defenders

1. You can find binaries on [releases page](https://github.com/opengs/uashield/releases)
2. Find the [latest release](https://github.com/opengs/uashield/releases/latest) and your platform
3. Download and run the binary file

**Running on Linux may require an additional `--no-sandbox` argument. It doesn't affect Windows**

## How it works

Our voluntary defense center works are doing all the hard work: monitoring the targets, running the technical infrastructure, coordinating the attack targets, coordinating with the client applications, etc.
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

Or use pre-built image:

```bash
docker run -d ghcr.io/opengs/uashield:0.0.x 512 true
```

## Docker-compose version

1. Run: `docker-compose up -d`
2. Edit variables `WORKERS` and `USEPROXY` in file `docker-compose.yml` - where `256` - threads count, and `true` | `false` if you want to use a proxy or not

## Deploy on Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Deploy with Ansible

[Readme](tools/ansible/README.md)

## Deploy with Play With Docker - free instance for 4 hours

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/0.0.x/pwd-docker-compose.yml)
