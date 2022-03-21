export default {
  language: 'Język',
  ddos: {
    description: 'Ataki DDoS robią bardzo dużo żądań do serwera wroga. Serwery dzięki temu zaczynają lagować i przestają przyjmować nowe żądania. Szczegóły tutaj: https://help-ukraine-win.com.ua/',
    coordinators: 'Koordynacja https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Zaatakowano już:',
      currentTarget: 'Aktualny cel: '
    },
    enable: {
      name: 'Atak DDoS',
      description: 'Włącza ataki DDoS na krytyczne serwery wroga: rząd, systemy bankowe, serwisy propagandowe.'
    },
    proxy: {
      name: 'Atakuj tylko z PROXY',
      description: 'Bez tej opcji program będzie używał Twojego IP. Jest to o wiele bardziej wydajne. Twoje ataki są mocniejsze, ale wróg pozna ten adres IP i przestaniesz być anonimowy.'
    },
    advanced: {
      header: 'Zaawansowane ustawienia',
      description: 'Jeżeli nie jesteś doświadczonym użytkownikiem nie zmieniaj ustawień zaawansowanych. Może to mieć zły wpływ na działanie programu.',
      masDosersCount: {
        name: 'Poziom równoległości',
        description: 'Definiuje ilość ataków uruchomionych jednocześnie , Aplikacja korzysta z operacji asynchronicznych a nie równoległych poprzez wątki, dzięki czemu CPU/RAM nie są mocno obciążone. Po zmianie wartości proces jej wprowadzania trwa około 10 sekund.'
      }
    },
    update: {
      title: 'Dostępna aktualizacja',
      cancel: 'Anuluj',
      confirm: 'Zainstaluj aktualizację'
    }
  }
}
