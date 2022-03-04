export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataque DDOS que realiza muchas requests/solicitudes a targets de servidores enemigos. Los targets/objetivos comenzarán a funcionar mal o con lag. https://help-ukraine-win.com/',
    counter: {
      attackedTimes: 'Número de ataques:',
      currentTarget: 'Target/Objetivo actual:'
    },
    enable: {
      name: 'Ataque DDOS',
      description: 'Habilitar ataque DDOS en servidores críticos enemigos: gobierno, sistemas bancarios, webs de propaganda, ...'
    },
    proxy: {
      name: 'Atacar sólo usando proxy',
      description: 'Sin esta opción, el programa permitirá usar tu IP. Realizarás ataques más eficientes, pero los ataques no serán anónimos.'
    },
    successBar: {
      title: 'Successful request statistics',
      restartVpn: 'Successful requests percent is less than 10, you should change your IP',
      keepVpn: 'The amount of successful requests is fine, keep using this IP'
    }
  }
}
