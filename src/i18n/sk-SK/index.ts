export default {
  language: 'Jazyk',
  ddos: {
    description: 'Útok DDoS generuje množstvo požiadavok na cieľový nepriateľský server. Cieľový server začne meškať a prestane správne fungovať.',
    coordinators: 'Koordinátori https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Počet útokov:',
      currentTarget: 'Aktuálny cieľ: '
    },
    enable: {
      name: 'DDoS útok',
      description: 'Povoliť DDoS útok na kritické nepriateľské servery: vládu, bankové systémy, propagandistické webové stránky atď..'
    },
    proxy: {
      name: 'Útočiť iba pomocou proxy',
      description: 'Bez tejto možnosti bude program môcť používať vašu IP. Tak urobí efektívnejší útok , ale vaše útoky nebudú anonymné.'
    },
    update: {
      title: 'Aktualizácia k dispozícii',
      cancel: 'Zrušiť',
      confirm: 'Nainštalujte aktualizácie'
    },
    advanced: {
      header: 'Rozšírené nastavenia',
      description: 'Ak vám niektorá terminológia nie je jasná, nemeňte rozšírené nastavenia. Môže to viesť k negatívnemu účinku a zníženiu účinnosti aplikácie',
      masDosersCount: {
        name: 'Úroveň paralelizmu',
        description: 'Určuje počet paralelných procesov. Program sa spolieha na asynchrónne operácie (nie paralelné medzi vláknami), takže nedochádza k preťaženiu CPU / RAM. Po nastavení zvyčajne trvá asi 10 sekúnd, kým sa počet paralelných procesov prispôsobí k novým nastaveniam.'
      }
    }
  }
}
