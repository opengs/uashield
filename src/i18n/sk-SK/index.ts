export default {
  language: 'Jazyk',
  ddos: {
    description: 'Útok DDoS generuje množstvo požiadaviek na cieľový nepriateľský server. Cieľový server začne meškať a prestane správne fungovať.',
    coordinators: 'Coordinátori https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Počet atakov na cieľ:',
      currentTarget: 'Súčastný cieľ:'
    },
    enable: {
      name: 'DDoS útok',
      description: 'Povoliť DDoS útok na kritické nepriateľské servery: vládu, bankové systémy, propagandistické webové stránky atď.'
    },
    proxy: {
      name: 'Útok iba za použia proxy',
      description: 'Bez tejto možnosti bude program môcť používať tvoju IP adresu. Urobíš tak efektívnejší útok, ale útoky nebudú anonymné.'
    },
    update: {
      title: 'Dostupná aktualizácia',
      cancel: 'Zrušiť',
      confirm: 'Inštalovať aktualizáciu'
    },
    advanced: {
      header: 'Rozšírené nastavenia',
      description: 'Ak ti niektorá terminológia nie je jasná, nemeň rozšírené nastavenia. Môže to viesť k negatívnemu účinku a zníženiu účinnosti aplikácie',
      masDosersCount: {
        name: 'Úroveň rovnobežnosti',
        description: 'Definuje množstvo dávkovačov. Aplikácia sa spolieha na asynchrónne operácie (nie paralelné cez vlákna), vďaka čomu nedochádza k preťaženiu CPU/RAM. Po úprave bude úprava množstva dávkovačov podľa nových nastavení zvyčajne trvať približne 10 sekúnd.'
      }
    }
  }
}
