export default {
  language: 'Język',
  ddos: {
    description: 'Ataki DDOS robią bardzo dużo żądań do serwera wroga. Serwery dzięki temu zaczynają lagować i przestają przyjmować nowe żądania.',
    coordinators: 'Koordynacja https://t.me/incourse911 ',
    counter: {
      atackedTimes: 'Zaatakowano już:',
      currentTarget: 'Aktualny cel: '
    },
    enable: {
      name: 'Atak DDOS',
      description: 'Włącza ataki DDOS na krytyczne serwery wroga: rząd, systemy bankowe, serwisy propagandowe.'
    },
    proxy: {
      name: 'Atakuj tylko z PROXY',
      description: 'Bez tej opcji program będzie używał Twojego IP. Jest to o wiele bardziej wydajne, Twoje ataki są mocniejsze, ale wróg poznaje Twój adres IP i nie będziesz anonimowy'
    },
    advanced: {
      header: 'Zaawansowane ustawienia',
      description: 'Jeżeli nie jesteś doświadczonym użytkownikiem nie zmieniaj ustawień zaawansowanych. Może to mieć zły wpływ na działanie programu',
      masDosersCount: {
        name: 'Рівень паралельності (TODO)',
        description: 'Задає кількість паралельних процесів. Використовуються асинхронічні механізми (не потокові), тому це не сильно впливає на CPU/RAM. Наразі опція діє в ручному режимі і задає кількість паралельних запитів. При великій кількості запитів, проксі сервера можуть блокувати DDOS. Змінюйте вартість і чекайте 2-3 хвилини, щоб побачити результат. Якщо бачите ECONNABORTED - це значить Вас блокують і треба зменшити кількість'
      }
    }
  }
}
