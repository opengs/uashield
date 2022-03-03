export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataque DDoS que realiza muchas requests/solicitudes a targets de servidores enemigos. Los targets/objetivos comenzarán a funcionar mal o con lag',
    coordinators: 'Coordinación:: https://t.me/incourse911',
    counter: {
      attackedTimes: 'Número de ataques:',
      currentTarget: 'Target/Objetivo actual: '
    },
    enable: {
      name: 'Ataque DDoS',
      description: 'Habilitar ataque DDoS en servidores críticos enemigos: gobierno, sistemas bancarios, webs de propaganda, ...'
    },
    proxy: {
      name: 'Atacar sólo usando proxy',
      description: 'Sin esta opción, el programa permitirá usar tu IP. Realizarás ataques más eficientes, pero los ataques no serán anónimos.'
    },
    advanced: {
      header: 'Extended settings',
      description: 'If some terminology is not clear for you, please do not change extended settings. It can lead to negative effect and decrease effectiveness of the application',
      masDosersCount: {
        name: 'Level of parallelism',
        description: 'Defines amount of threads. Application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust amount of threads according to new settings'
      }
    }
  }
}
