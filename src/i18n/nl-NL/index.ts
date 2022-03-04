export default {
  language: 'Taal',
  ddos: {
    description: 'DDoS aanvallen genereren enorm veel aanvragen met als doel de vijandige computer servers, De servers zullen een overload krijgen een daardoor stoppen met functioneren.',
    coordinators: 'De planners van de aanval: https://discord.gg/7BfJ9JKQ98',
    counter: {
      attackedTimes: 'Aantal aanvallen:',
      currentTarget: 'Huidige doelwit: '
    },
    enable: {
      name: 'DDoS aanvallen',
      description: "We vallen kritische doelen aan zoals: de overheid, bank systemen, propaganda pagina's ect."
    },
    proxy: {
      name: 'Val enkel aan met gebruik van proxy',
      description: 'Zonder gebruik hiervan kan het programma jou eigen ip adres gebruiken, dit werkt wel efficiënter maar jou aanval zal dan niet meer anoniem zijn.'
    },
    update: {
      title: 'Update beschikbaar',
      cancel: 'Anuleren',
      confirm: 'Update instaleren'
    },
    advanced: {
      header: 'Uitgebreide instellingen',
      description: 'Als bepaalde termen niet geheel duidelijk zijn voor je, verander dan geen van de uitgebreide instellingen, het kan de efficiëntie van het programma negatief beïnvloeden',
      masDosersCount: {
        name: 'Niveau van parallellen',
        description: 'Definieer de hoeveelheid aanvallen. De applicatie is gebaseerd op asynchrone operaties en niet parallel via aparte kanalen, waar door jou CPU/RAM geen overload krijgen, eenmaal aangepast zullen de instellingen na ongeveer 10 seconde aangepast zijn naar de hoeveelheid aanvallen die je heb ingesteld.'
      }
    }
  }
}
