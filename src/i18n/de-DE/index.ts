export default {
  language: 'Sprache',
  ddos: {
    description: 'Ein DDoS-Angriff sendet eine große Anzahl von Anfragen an feindliche Websites aus, wodurch diese überlastet und deaktiviert werden. Infolge des DDoS-Angriffs können die Server nicht gewöhnlich arbeiten / laggen oder funktionieren überhaupt nicht.',
    coordinators: 'Für Koordinationszwecke: https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Bereits erfolgte Angriffe:',
      currentTarget: 'Aktuelles Ziel: '
    },
    enable: {
      name: 'DDoS-Angriff',
      description: 'Ermöglicht DDoS-Angriffe auf die wichtigsten feindlichen Systeme: Regierungsseiten, Bankensysteme, Propaganda-Öffentlichkeit usw. Die aktuellen Angriffsziele werden auf der Seite angezeigt.'
    },
    proxy: {
      name: 'Angreifen nur über einen Proxy',
      description: 'Bei einem Proxy-freien Angriff kann das Programm Ihre echte IP verwenden. Dadurch können Sie Angriffe effektiver gestalten, aber gleichzeitig mache Sie Ihre IP dem Feind bekannt.'
    },
    update: {
      title: 'Update verfügbar',
      cancel: 'Abschaffung',
      confirm: 'Installiere Updates'
    },
    advanced: {
      header: 'Erweiterte Einstellungen',
      description: 'Wenn Sie ein unerfahrener Benutzer sind und einige der Konzepte nicht verstehen, ändern Sie bitte nicht die erweiterten Einstellungen. Dies kann wiederum den Betrieb des Programms beeinträchtigen',
      masDosersCount: {
        name: 'Die Ebene der Parallelität',
        description: 'Gibt die Anzahl paralleler Prozesse an. Es werden asynchrone Mechanismen (Non-Streaming) verwendet, sodass CPU / RAM nicht stark beeinträchtigt werden. Nach dem Wechsel müssen Sie ~ 10 Sekunden warten, bis die zusätzlichen parallele Prozesse starten.'
      }
    }
  }
}
