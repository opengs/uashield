export default {
  language: 'Language',
  ddos: {
    description: 'DDoS attack generates a lot of requests to the target enemy server. Target server will start to lag and stop working properly.',
    coordinators: 'Coordinators https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Times attacked:',
      currentTarget: 'Current target: '
    },
    enable: {
      name: 'DDoS attack',
      description: 'Enable DDoS attack on critical enemy servers: government, banking systems, propaganda webpages, etc'
    },
    proxy: {
      name: 'Attack only using proxy',
      description: 'Without this option, program will be allowed to use your IP. You will make more efficient attack, but attacks will not be anonymous.'
    },
    update: {
      title: 'Update available',
      cancel: 'Cancel',
      confirm: 'Install update'
    },
    advanced: {
      header: 'Extended settings',
      description: 'If some terminology is not clear for you, please do not change extended settings. It can lead to negative effect and decrease effectiveness of the application',
      masDosersCount: {
        name: 'Level of parallelism',
        description: 'Defines the amount of dosers. Application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust amount of the dosers according to new settings.'
      }
    }
  }
}
