export default {
  language: 'Jazyk',
  ddos: {
    description: 'DDoS útok generuje mnoho požadavků na cílový nepřátelský server. Cílový server se začne zpožďovat a přestane správně fungovat.',
    coordinators: 'Koordinátoři https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Počet napadení:',
      currentTarget: ' Aktuální cíl: '
    },
    enable: {
      name: 'DDoS útok',
      description: 'Povolit DDoS útok na kritické nepřátelské servery: vládu, bankovní systémy, propagandistické webové stránky atd'
    },
    proxy: {
      name: 'Útok pouze pomocí proxy',
      description: 'Bez této možnosti bude programu povoleno používat vaši IP. Uděláte efektivnější útok, ale útoky nebudou anonymní.'
    },
    update: {
      title: 'Aktualizace k dispozici',
      cancel: 'Zrušení',
      confirm: 'Instalovat aktualizace'
    },
    advanced: {
      header: 'Rozšířené nastavení',
      description: 'Pokud vám některá terminologie není jasná, neměňte prosím rozšířená nastavení. To může vést k negativnímu efektu a snížení účinnosti aplikace',
      masDosersCount: {
        name: 'Úroveň paralelismu',
        description: 'Definuje množství paralelní procesy. Aplikace spoléhá na asynchronní operace (ne paralelní přes vlákna), díky tomu nedochází k přetěžování CPU/RAM. Po nastavení bude obvykle trvat asi 10 sekund, než se množství paralelní procesy přizpůsobí novým nastavením.'
      }
    }
  }
}
