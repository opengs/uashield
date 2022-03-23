`# UA Cyber SHIELD

*Nie wspieramy bezprawnych aktywnych ataków ani kampanii złośliwego oprogramowania, które powodują szkody techniczne. Używaj tego oprogramowania tylko do celów edukacyjnych. Możesz wypróbować tę platformę tylko na własnej stronie internetowej!*

*Дивись цю сторінку [українською](README.md)*

[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

**Dobrowoly system cyberobrony Ukrainy**

- Społeczność: [Discord](https://discord.gg/7BfJ9JKQ98) [Telegram](https://t.me/uashield)
- Instrukcja video - po ukraińsku [in Ukrainian](https://youtu.be/snTzpRt7a5k)

## Dla cyber-obrońców

1. Binaria aplikacji dostępne są tutaj [wydania](https://github.com/opengs/uashield/releases)
2. Znajdź [Najnowsza wersja](https://github.com/opengs/uashield/releases/latest) and your platform
3. Pobierz i uruchom

**Uruchomienie w systemie Linux może wymagać dodatkowego parametru`--no-sandbox`. Nie jest on wymagany w systemie Windows**

## Jak to działa

Nasze centrum obrony dzięki wolontariuszom wykonuje całą ciężką pracę: monitorowanie celów, prowadzenie infrastruktury technicznej, koordynowanie celów ataków, synchronizowanie ich z aplikacjami klienckimi itp.
Po przeprowadzeniu ataku aplikacja automatycznie pobiera potrzebne dane.
Jedyne, co musisz zrobić, to zainstalować ją i uruchomić.
Zaatakowane cele są automatycznie zmieniane i pobierane z centrum kontroli / serwera nadzorujacego.

## Interfejs Aplikacji

![Przykład:](docs/working.png)

## Uruchamianie z kodu źrodłowego

1. Sklonuj repozytorium: `git clone https://github.com/opengs/uashield.git`
2. Zainstaluj zależności: `cd uashield && npm install`
3. Zbuduj: `npm run build:electron`
4. Uruchom z `./dist/electron` lub poprzez electron: `npm run start:electron`

## Wersja nienadzorowana (Docker)

1. Zbuduj obraz: `docker build . -t uashield`
2. Uruchom: `docker run uashield 512 true` - gdzie `512` - ilość wątków, a`true` | `false` oznacza czy chcesz używać proxy

Lub użyj [gotowy-obraz](https://github.com/opengs/uashield/pkgs/container/uashield):

```bash
docker run -d ghcr.io/opengs/uashield:master 512 true
```

## Poprzez Docker-compose

1. Uruchom: `docker-compose up -d`
2. Ustaw zmienne `WORKERS` i `USEPROXY` w pliku `docker-compose.yml` - gdzie `256` - ilość wątków, i `true` | `false` oznacza czy chcesz używać proxy

## Uruchom na Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Zainstaluj z Ansible

[tools/ansible/README.md](tools/ansible/README.md)

## Zainstaluj na Kubernetes

[tools/helm/README.md](tools/helm/README.md)

## Uruchom z "Play With Docker" - darmowa instancja na 4 godziny

[![uruchoim z PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/master/pwd-docker-compose.yml)

## Dotacje
Dotacje zostaną wykorzystane na następujące cele:
1. Wydatki na nowe serwery proxy
2. Wydatki na pozostałą infrastrukture IT dla systemu

Gdy wygramy wojnę, a na Ukrainie zapanuje pokój, pozostałe środki zostaną przekazane na fundusze charytatywne na pomoc ofiarom wojny.

Wesprzyj nas poprzez:
- BTC: bc1q7e6ew74x56vdpsev5ycqq8ke3tk4yv5452l25g
- ETH: 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F
- USDT (ETH): 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F **adres w sieci ETH**

Możesz takze kupić programistom kawę, aby oglo kodować tą aplikacje całą noc:
- BTC: bc1q7g5s3c89lymc9vtrf0y8tqyx4mg0hefeyr6zsv
- ETH: 0x75A291AB6795f747177975bac250B47A33ee54Ed
- USDT (ETH): 0x75A291AB6795f747177975bac250B47A33ee54Ed **adres w sieci ETH**

Dodamy więcej opcji w przyszłości :)
