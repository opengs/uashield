# UA Cyber SHIELD

*ALERT!!! We not supporting unlawful active attack or malware campaings that are causing technical harms. Use only for educational purposes. You can only try this platform on your own website!*

*See this README [in English](README-en.md)*

[![Release](https://img.shields.io/badge/Release-latest-blue)](https://github.com/opengs/uashield/releases/latest)

**Система волонтерської кібероборони України**

- Ком'юніті: [Discord](https://discord.gg/7BfJ9JKQ98) [Telegram](https://t.me/uashield)
- Відео інструкція [українською](https://youtu.be/snTzpRt7a5k)

## Для кіберзахисників

1. Програми знаходяться в [релізах](https://github.com/opengs/uashield/releases)
2. Вибираємо [найновший реліз](https://github.com/opengs/uashield/releases/latest) і свою платформу
3. Скачуємо і запускаємо

**У користувачів на Linux можливо треба буде додати аргумент `--no-sandbox`. На Windows має працювати без будь-яких додаткових аргументів**

## Як це працює

Наш центр волонтерів займається всією тяжкою роботою: моніторингом цілей, підтримкою технічної інфраструктури, координацією атак, передачею даних до програм клієнтів, тощо.
Тому на момент атаки всі підготовчі дані є.
Вам залишається тільки встановити програму і приєднатися.
Цілі змінюються автоматично і підвантажуються з центру координації.

## Інтерфейс програми

![A working example](docs/working.png)

## Збірка коду

1. Клонуємо репозиторій: `git clone https://github.com/opengs/uashield.git`
2. Встановлюємо залежності: `cd uashield && yarn install`
3. Збираємо програму: `yarn build:electron`
4. Запускаємо виконавчий файл в `./dist/electron` або електрон версію: `yarn start:electron`

### Збірка коду - headless

1. Збираємо програму: `yarn build:headless`
2. Запускаємо `yarn start:headless`

## Headless версія (Docker)

1. Збірка образу: `docker build . -t uashield`
2. Запуск: `docker run uashield 500 true` - де `500` - кількість потоків, і `true` | `false` чи ви бажаєте використовувати проксі

Або за допомогою вже [зібраного образу](https://github.com/opengs/uashield/pkgs/container/uashield):

```bash
docker run -d ghcr.io/opengs/uashield:master 512 true
```

## Docker-compose версія

1. Запуск: `docker-compose up -d`
2. Відредагуйте значення змінних `WORKERS` та `USEPROXY` в файлі `docker-compose.yml` - де `256` - кількість потоків, і `true` | `false` чи ви бажаєте використовувати проксі

## Розгортання на Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Розгортання за допомогою Ansible

[tools/ansible/README.md](tools/ansible/README.md)

## Розгортання у Kubernetes

[tools/helm/README.md](tools/helm/README.md)

## Розгортання на Play With Docker - безкоштовний інстанс на 4 години

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/master/pwd-docker-compose.yml)

## Пожертвування
Пожертвування будуть використовуватися виключно для цілей програми:
1. Закупівля проксі серверів для атак
2. Зрідка закупівля серверів для розміщення IT інфраструктури

Коли ми переможемо в цій війні і настане мирний час, гроші що залишаться будуть передані благодійним організаціям на допомогу жертвам цієї війни.

Рахунки для переказу коштів:
- BTC: bc1q7e6ew74x56vdpsev5ycqq8ke3tk4yv5452l25g
- ETH: 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F
- USDT (ETH): 0x9472538607eE28F69FE7dAcD6C4cC17B9A20664F **ця адреса в мережі ETH**

Якшо ви хочете почастувати розробників кавою щоб вони могли прогулювати роботу і не спати ночами:
- BTC: bc1q7g5s3c89lymc9vtrf0y8tqyx4mg0hefeyr6zsv
- ETH: 0x75A291AB6795f747177975bac250B47A33ee54Ed
- USDT (ETH): 0x75A291AB6795f747177975bac250B47A33ee54Ed **ця адреса в мережі ETH**

В майбутньому ми додамо їх ще більше :)
