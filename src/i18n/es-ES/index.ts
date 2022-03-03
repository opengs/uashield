export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataque DDoS que realiza muchas requests/solicitudes a targets de servidores enemigos. Los targets/objetivos comenzarán a funcionar mal o con lag',
    coordinators: 'Coordinación: https://discord.gg/7BfJ9JKQ98',
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
      header: 'Configuración extendida',
      description: 'Si alguna terminología no es clara para uster, por favor, no cambie la configuración extendida. Puede conllevar efectos negativos y disminuir la efectividad de la aplicación',
      masDosersCount: {
        name: 'Nivel de paralelismo',
        description: 'Define la cantidad de hilos/threads. La aplicación se basa en operaciones asíncronas (no paralela via threads/hilos), gracias a ello la CPU/RAM no se sobrecarga. Una vez ajustado, tomará alrededor de 10 segundos en ajustar la cantidad de threads o hilos de acuerdo a la nueva configuración'
      }
    }
  }
}
