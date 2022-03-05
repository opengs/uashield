export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataque DDOS que realiza muchas requests/solicitudes a targets de servidores enemigos. Los targets/objetivos comenzarán a funcionar mal o con lag. https://help-ukraine-win.com/',
    coordinators: 'Coordinación de acciones: https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Número de ataques:',
      currentTarget: 'Target/Objetivo actual: '
    },
    enable: {
      name: 'Ataque DDOS',
      description: 'Habilitar ataque DDOS en servidores críticos enemigos: gobierno, sistemas bancarios, webs de propaganda, ...'
    },
    proxy: {
      name: 'Atacar sólo usando proxy',
      description: 'Sin esta opción, el programa permitirá usar tu IP. Realizarás ataques más eficientes, pero los ataques no serán anónimos.'
    },
    advanced: {
      header: 'Configuraciones extendidas',
      description: 'Si la terminología no está clara para ti, no cambies la configuración extendida. Puede tener un impacto negativo y disminuir la eficacia de la aplicación.',
      masDosersCount: {
        name: 'Nivel de paralelismo',
        description: 'Tú defines la cantidad de dosificadores. La aplicación se basa en operaciones asíncronas, gracias a esto la CPU/memoria no están sobrecargadas. Una vez ajustado, tardará unos 10 segundos en ajustar la cantidad de dosificadores según la nueva configuración.'
      }
    }
  }
}
