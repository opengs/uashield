# UA Cyber SHIELD

*UPOZORNENIE!!! Nepodporujeme nezákonný aktívny útok alebo malware kampane, ktoré spôsobujú technické škody. Používajte len na vzdelávacie účely. Túto prlatformu môžete vyskúšať len na svojich vlastných webových stránkach!*

*Prečitať súbor README [v Ukrajinčine](README.md)*
*Prečitať súbor README [v Angličtine](README-en.md)*


[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

**Dobrovoľný ukrajinský systém kybernetickej obrany**

- Komunita: [Discord](https://discord.gg/7BfJ9JKQ98)
- Videonávod [po ukrajinsky](https://youtu.be/snTzpRt7a5k)

## Pre kybernetických ochrancov

1. Zdrojové súbory nájdeš na adrese [releases page](https://github.com/opengs/uashield/releases)
2. Nájdi [latest release](https://github.com/opengs/uashield/releases/latest) a tvoj operačný systém
3. Stiahnu a spusti súbor

**Spustenie v systéme Linux môže vyžadovať ďalší príkaz `--no-sandbox`. Nemá vplyv na Windows a Mac OS**

## Ako to funguje
Naše dobrovoľné obranné centrum vykonáva všetku ťažkú prácu: monitorovanie cieľov, prevádzkovanie technickej infraštruktúry, koordináciu cieľov útoku, koordináciu s klientskými aplikáciami atď.
Keď sa útok vykoná, aplikácia automaticky získa údaje, ktoré potrebuje.
Jediné, čo musíte urobiť, je nainštalovať ju.
Ciele, na ktoré sa útočí, sa automaticky menia a sťahujú sa z riadiaceho centra/servera.

## Programové rozhranie

![A working example](docs/working.png)

## Ako zostavovať zo zdrojového kódu

1. Naklonuj repozitár: `git clone https://github.com/opengs/uashield.git`
2. Nainštaluj potrebný software: `cd uashield && npm install`
3. Spusti build: `npm run build:electron`
4. Spusti kód z `./dist/electron` alebo elektron verziu: `npm run start:electron`

## Verzia bez hlavy (Docker)

1. Zostav build: `docker build . -t uashield`
2. Spusti: `docker run uashield 512 true` - kde `512` - je počet vlákien a `true` | `false` ak chceš používať proxy server alebo nie

Alebo použi [pre-built image](https://github.com/opengs/uashield/pkgs/container/uashield):

```bash
docker run -d ghcr.io/opengs/uashield:0.0.x 512 true
```

## Verzia nástroja Docker-compose

1. Spusti: `docker-compose up -d`
2. Uprav premenné `WORKERS` a `USEPROXY` v súbvore `docker-compose.yml` - kde `256` - je počet vlákien a `true` | `false` ak chceš používať proxy server alebo nie

## Nasadenie na Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Nasadenie pomocou Ansible

[tools/ansible/README.md](tools/ansible/README.md)

## Nasadenie do služby Kubernetes

[tools/helm/README.md](tools/helm/README.md)

## Nasadenie pomocou aplikácie Play With Docker - inštancia zdarma na 4 hodiny

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/0.0.x/pwd-docker-compose.yml)

## Príspevky
Príspevky sa použijú na financovanie našej činnosti:
1. Výdavky na neustále kupovanie nových proxy serverov
2. Z času na čas nákup serverov pre novú infraštruktúru

Keď vyhráme vojnu a na Ukrajine bude mier, finančné prostriedky sa prevedú dobrovoľným združeniam na pomoc obetiam tejto vojny.

Môžeš nám pomôcť aj prostredníctvom BITCOIN-u:
- BTC: 11wxDarouPfY6P3misLvFuJ8k8oWhd4qb

Ak chcete prispieť vývojárom na nejakú tu kávu, tu sú aj iné varianty. Aby sme mohli pokračovať vo vynechávaní práce a investovať čas do projektu po celé noci:
- BTC: 12CcLYn6zrBcnmvK5fRSAQcJre5jknyTxH

Ďalšie varianty pridáme neskôr :)
