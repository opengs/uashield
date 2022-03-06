export default {
  language: 'Język',
  ddos: {
    description: 'Ataki DDoS robią bardzo dużo żądań do serwera wroga. Serwery dzięki temu zaczynają lagować i przestają przyjmować nowe żądania. Szczegóły tutaj: https://help-ukraine-win.com/',
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
      description: 'Bez tej opcji program będzie używał Twojego IP. Jest to o wiele bardziej wydajne, Twoje ataki są mocniejsze, ale wróg poznaje Twój adres IP i nie będziesz anonimowy'
    },
    advanced: {
      header: 'Zaawansowane ustawienia',
      description: 'Jeżeli nie jesteś doświadczonym użytkownikiem nie zmieniaj ustawień zaawansowanych. Może to mieć zły wpływ na działanie programu',
      masDosersCount: {
        name: 'Poziom równoległości',
        description: 'Określa liczbę równoległych procesów. Stosowane są mechanizmy asynchroniczne (nie strumieniowe), więc nie ma to dużego wpływu na procesor / RAM. Obecnie opcja działa w trybie manualnym i określa liczbę równoległych zapytań. Przy dużej liczbie requestów proxy serwery mogą blokować DDOS. Zmień znaczenie i poczekaj 2-3 minuty, aby zobaczyć wynik. Jeśli widzisz ECONNABORTED - oznacza to, że jesteś zablokowany i musisz zmniejszyć liczbę/ilość'
      }
    },
    update: {
      title: 'Dostępna aktualizacja',
      cancel: 'Anuluj',
      confirm: 'Zainstaluj aktualizację'
    }
  }
}
