# UA Cyber SHIELD
Система волонтерської кібероборони України  / The voluntary Ukrainian cyber defence system

Комюніті / Community: [Discord](https://discord.gg/7BfJ9JKQ98)

[Відео інструкція українською](https://youtu.be/snTzpRt7a5k)

## Для захисників / For cyber defenders
#### УКР
1. Програми знаходяться в [релізах](https://github.com/opengs/uashield/releases).
2. Вибераємо найновший реліз і свою платформу
3. Скачуємо і запускаємо

**В користувачів на Linux можливо треба буде додати аргумент "--no-sandbox" . Windows повинен працювати без всяких додаткових речей.**

#### ENG
1. You can find pre-compiled binaries in the [releases](https://github.com/opengs/uashield/releases) section.
2. Double-check for the latest release and your platform
3. Download and run

** Running on Linux may require an additional "--no-sandbox" argument. We are trying to solve this problem. On Windows everything works without any additional efforts.**

## Як це працює / How it works
#### УКР
Наш центр волонтерів займається всією тяжкою роботою: моніторингом цілей, підтримкою технічної структури, координацією атак, передачі даних до програм клієнтів, тощо. Тому на момент атаки всі підготовчі дані є. Вам остається тільки встановити програму і приєднуватися. Цілі міняються автоматично і підгружаються з центру координації

#### ENG
Our voluntary defence center works is doing all the hard work: monitoring the targets, running the technical infrastructure, cooridnation of the attack targets, coordination with the client applications, etc. When the attack is performed, the application gets the data that it needs automatically. The only thing you need to do is to install it. Targets being attacked are changed automatically and are downloaded from the control center/server.

![A working example](docs/working.png)

## Для розробників / Developer zone
#### УКР
**Білд із джерельних кодів**
1. Клонуємо репозиторій `git clone https://github.com/opengs/uashield.git`
2. Встановлюємо залежності `cd uashield && npm install`
3. Запускаємо білд `npm run build:electron`
4. Запускаємо виконавчий файл в `./dist/electron` або електрон версію в `npm run start:electron`

#### ENG
**Building from sources**
1. Clone the repo `git clone https://github.com/opengs/uashield.git`
2. Install dependencies `cd uashield && npm install`
3. Build `npm run build:electron`
4. Start the executable in `./dist/electron`, or start the **electron** version `npm run start:electron`

## Headless версія / Headless version
1. `docker build . -t uashield`
2. `docker run uashield 500 true` - де `500` - номер потоків, і `true` | `false` чи ви бажаєте використати проксі

1. `docker build . -t uashield`
2. `docker run uashield 500 true` - where `500` - number of threads, and `true` | `false` if you want to use proxy


## Deploy attacker on your Raspberry Pi!
[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/opengs/uashield)
