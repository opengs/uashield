export default {
  ddos: {
    description: 'Ataki DDOS robią bardzo dużo żądań do serwera wroga. Serwery dzięki temu zaczynają lagować i przestają przyjmować nowe żądania.',
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
      description: 'Bez tej opcji program będzie używał Twojego IP. Jest to o wiele bardziej wydajne, Twoje ataki są mocniejsze, ale wróg poznaje Twój adres IP i nie będziesz anonimowy.'
    }
  }
}
