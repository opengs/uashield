export default {
  language: 'Jazyk',
  ddos: {
    description: 'DDoS attack generates a lot of requests to the target enemy server. Target server will start to lag and stop working properly.',
    coordinators: 'Koordinátoři https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Počet napadnutí:',
      currentTarget: 'Aktuální cíl:'
    },
    enable: {
      name: 'DDoS útok',
      description: 'Povolit útok DDoS na kritické nepřátelské servery: vládní, bankovní systémy, propagandistické webové stránky atd. v Rusku'
    },
    proxy: {
      name: 'DDoS útoky pouze prostřednictvím proxy servru',
      description: 'Bez této možnosti bude program moci používat vaši IP adresu. Útoky budou efektivnější, ale nebudou anonymní.'
    },
    update: {
      title: 'Dostupná aktualizace',
      cancel: 'Zrušit',
      confirm: 'Instalovat aktualizaci'
    },
    advanced: {
      header: 'Rozšířené nastavení',
      description: 'Pokud vám některé pojmy nejsou jasné, neměňte rozšířená nastavení. Může to vést k negativnímu efektu a snížení účinnosti aplikace.',
      masDosersCount: {
        name: 'Úroveň paralelismu',
        description: 'Definuje množství dávkovačů. Aplikace se spoléhá na asynchronní operace (nikoliv paralelní prostřednictvím vláken), díky čemuž nedochází k přetěžování CPU/RAM. Po nastavení obvykle trvá přibližně 10 sekund, než se množství doserů upraví podle nového nastavení.'
      }
    }
  }
}
