export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataque DDOS que realiza muchas requests/solicitudes a targets de servidores enemigos. Los targets/objetivos comenzarán a funcionar mal o con lag. https://help-ukraine-win.com/',
    coordinators: 'Para fines de coordinación: https://discord.gg/7BfJ9JKQ98',
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
    advanced: {
      header: 'Ajustes avanzados',
      description: 'Si alguna terminología no le resulta clara, no cambie la configuración ampliada. Puede provocar un efecto negativo y disminuir la eficacia de la aplicación.',
      masDosersCount: {
        name: 'El nivel de paralelismo',
        description: 'Determina el número de procesos paralelos. La aplicación se basa en operaciones asíncronas (no en flujos paralelos), por lo que la CPU/RAM no se sobrecarga. Después de la configuración, los cambios suelen tardar unos 10 segundos en surtir efecto.'
      }
    },
    update: {
      title: 'Actualización disponible',
      cancel: 'Cancelar',
      confirm: 'Instalar actualizaciones'
    }
  }
}
