export default {
  language: 'Language',
  ddos: {
    description: 'DDoS attack generates a lot of requests to the target enemy server. Target server will start to lag and stop working properly.',
    coordinators: 'Coordinators https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Times attacked:',
      currentTarget: 'Current target: '
    },
    efficiency: 'Efficiency',
    enable: {
      name: 'DDoS attack',
      description: 'Enable DDoS attack on critical enemy servers: government, banking systems, propaganda webpages, etc'
    },
    proxy: {
      name: 'Attack only using proxy',
      description: 'Without this option, the program will use the actual IP address of your computer. This allows to make the attack much more efficient, but attacks will not be anonymous and your IP address will be visible to the enemy.'
    },
    update: {
      title: 'Update available',
      cancel: 'Cancel',
      confirm: 'Install update'
    },
    advanced: {
      header: 'Extended settings',
      description: 'If some terminology is not clear for you, please do not change extended settings. It can lead to negative effects and decrease the effectiveness of the application.',
      automaticMode: {
        name: 'Automatic mode',
        description: 'When enabled, program analizes efficiency and automatically selects level of parallelism'
      },
      masDosersCount: {
        name: 'Level of parallelism',
        description: 'Defines the number of attack processes. The application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust the amount of the attack processes according to new settings.'
      }
    }
  }
}
