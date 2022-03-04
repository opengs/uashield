export default {
  language: 'Sprache',
  ddos: {
    description: 'DDoS-Angriff erzeugt eine Menge von Anfragen an den gegnerischen Zielserver. Der Zielserver beginnt zu hinken und funktioniert nicht mehr richtig.',
    coordinators: 'Die Koordinatoren https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'angegriffene Webseiten:',
      currentTarget: 'Derzeitiges Ziel:'
    },
    enable: {
      name: 'DDoS-Angriff',
      description: 'Ermöglichung von DDoS-Angriffen auf wichtige feindliche Server: Regierung, Bankensysteme, Propaganda-Webseiten usw. in Russland.'
    },
    proxy: {
      name: 'Angriffe nur über Proxy',
      description: 'Ohne diese Option ist es dem Programm erlaubt, Ihre IP-Adresse zu verwenden. Sie werden effizientere Angriffe durchführen, aber die Angriffe werden nicht anonym sein.'
    },
    update: {
      title: 'Aktualisierung verfügbar',
      cancel: 'Abrechen',
      confirm: 'Aktualisierung installieren'
    },
    advanced: {
      header: 'Erweiterte Einstellungen',
      description: 'Wenn einige Begriffe für Sie nicht klar sind, ändern Sie bitte keine erweiterten Einstellungen. Dies kann negative Auswirkungen haben und die Effektivität der Anwendung verringern.',
      masDosersCount: {
        name: 'Parallelitätsgrad',
        description: 'Definiert die Anzahl der Doser. Die Anwendung stützt sich auf asynchrone Operationen (nicht parallel über Threads), so dass CPU/RAM nicht überlastet werden. Einmal eingestellt, dauert es in der Regel etwa 10 Sekunden, um die Anzahl der Doser entsprechend den neuen Einstellungen anzupassen.'
      }
    }
  }
}
