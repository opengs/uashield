export default {
  language: 'Jazyk',
  ddos: {
    description: 'DDoS útok generuje velké množství požadavků na cílový server nepřítele. Cílový server se zahltí a přestane správně fungovat.',
    coordinators: 'Koordinace https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Počet provedených útoků:',
      currentTarget: 'Aktuální cíl:'
    },
    enable: {
      name: 'DDoS útok',
      description: 'Povolit DDoS útok na kritické servery nepřítele: vláda, bankovní systémy, propagandistické zpravodajství, atp.'
    },
    proxy: {
      name: 'Útočit pouze prostřednictvím proxy',
      description: 'Bez této možnosti aplikace použije vaší IP. Útok bude efektivnější, nicméně nebude anonymní.'
    },
    update: {
      title: 'Dostupná aktualizace',
      cancel: 'Zrušit',
      confirm: 'Instalovat aktualizaci'
    },
    advanced: {
      header: 'Pokročilé nastavení',
      description: 'Jestliže nevíte co děláte, prosím, neměňte tato nastavení. Neodborné zásahy mohou způsobit negativní efekty.',
      masDosersCount: {
        name: 'Úroveň paralelismu',
        description: 'Určuje počet dávkovačů. Aplikace se spoléhá na asynchronní operace (nikoli paralelní přes vlákna), díky tomu nejsou přetíženy systémové zdroje. Trvá zhruba 10 sekund než se nové nastavení projeví ve fungování aplikace.'
      }
    }
  }
}