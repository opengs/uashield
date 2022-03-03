---
title: Налаштування
description: ''
position: 2
category: Керівництво
---

## Для кіберзахисників

1. Програми знаходяться в [релізах](https://github.com/opengs/uashield/releases)
2. Вибираємо [найновший реліз](https://github.com/opengs/uashield/releases/latest) і свою платформу
3. Скачуємо і запускаємо

**В користувачів на Linux можливо треба буде додати аргумент `--no-sandbox`. Windows повинен працювати без всяких додаткових речей**

## Збірка коду

1. Клонуємо репозиторій: `git clone https://github.com/opengs/uashield.git`
2. Встановлюємо залежності: `cd uashield && npm install`
3. Запускаємо білд: `npm run build:electron`
4. Запускаємо виконавчий файл в `./dist/electron` або електрон версію: `npm run start:electron`

## Headless версія (Docker)

1. Збірка імежду: `docker build . -t uashield`
2. Запуск: `docker run uashield 500 true` - де `500` - кількість потоків, і `true` | `false` чи ви бажаєте використати проксі

Або за допомогою вже зібраного імежду:

```bash
docker run -d ghcr.io/opengs/uashield:0.0.x 512 true
```

## Docker-compose версія

1. Запуск: `docker-compose up -d`
2. Відредагуйте значення змінних `WORKERS` та `USEPROXY` в файлі `docker-compose.yml` - де `256` - кількість потоків, і `true` | `false` чи ви бажаєте використати проксі

## Деплой на Raspberry Pi

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)

## Деплой за допомогою Ansible

[Readme](tools/ansible/README.md)

## Деплой на Play With Docker - безкоштовний інстанс на 4 години

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/opengs/uashield/0.0.x/pwd-docker-compose.yml)
