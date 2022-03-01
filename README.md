# UA Cyber SHIELD
Система волонтерської кібероборони України  / Ukrainian voluntary cyber defence system

Комюніті / community: [Discord](https://discord.gg/7BfJ9JKQ98)

[Відо інструкція на українській мові](https://youtu.be/snTzpRt7a5k)

## Для захисників / For defenders
1. Програми знаходяться в [релізах](https://github.com/opengs/uashield/releases).
2. Вибераємо найновший реліз і свою платформу
3. Скачуємо і запускаємо

**В користувачів на Linux можливо треба буде додати аргумент "--no-sandbox" . Windows повинен працювати без всяких додаткових речей.**

1. Compileg programs are in [releases](https://github.com/opengs/uashield/releases).
2. Check newest release and you platform
3. Download and run

**Linux may require additional "--no-sandbox" argument. We are trying to solve this problem. Windows works without any additional steps.**

## Як це працює / How it works
Наш центр волонтерів займається всією тяжкою роботою: моніторингом цілей, підтримкою технічної структури, координацією атак, передачі даних до програм клієнтів, тощо. Тому на момент атаки всі підготовчі дані є. Вам остається тільки встановити програму і приєднуватися. Цілі міняються автоматично і підгружаються з центру координації

Our voluntary center works with all hard work: monitoring targets, keeping technical structure, atack coordination, coordination with clients programs, ... When atack is performed - program has all the data that i needs. You just have to install program. Targets are changing automatically and are downloading from coordination center.

![Working example](docs/working.png)

## Для розробників / For Developers

**Білд із джерельних кодів**
1. Клонуємо репозиторій `git clone https://github.com/opengs/uashield.git`
2. Встановлюємо залежності `cd uashield && npm install`
3. Запускаємо білд `npm run build:electron`
4. Запускаємо виконавчий файл в `./dist/electron` або електрон версію в `npm run start:electron`

**Build from sources**
1. Clone repo `git clone https://github.com/opengs/uashield.git`
2. Install dependencies `cd uashield && npm install`
3. Build `npm run build:electron`
4. Start executable in `./dist/electron` or start electron version `npm run start:electron`
