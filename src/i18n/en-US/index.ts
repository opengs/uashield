export default {
  language: 'Language',
  main: {
    ddos: {
      ip: {
        name: 'Your IP'
      },
      enable: {
        name: 'DDoS attack',
        description: 'Enable DDoS attack on critical enemy servers: government, banking systems, propaganda webpages, etc'
      },
      proxy: {
        name: 'Use proxy (low efficiency)',
        description: 'Without this option, the program will use the actual IP address of your computer. This allows to make the attack much more efficient, but attacks will not be anonymous and your IP address will be visible to the enemy. Use VPN to hide your real address'
      },
      advanced: {
        automaticMode: {
          name: 'Auto parallelism level',
          description: 'When enabled, program analizes efficiency and automatically selects level of parallelism'
        },
        maxDosersCount: {
          name: 'Number of threads',
          description: 'Defines the number of attack processes. The application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust the amount of the attack processes according to new settings.'
        }
      },
      update: {
        title: 'Update available',
        cancel: 'Cancel',
        confirm: 'Install update'
      }
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      autoLaunch: {
        title: 'Launch at startup',
        description: 'Launch application on start up (Windows / MacOS)'
      },
      logRequests: {
        title: 'Log requests',
        description: 'Dump status of every request to the log'
      },
      logTimestamp: {
        title: 'Log timestamp',
        description: 'Log timestamp with logger message'
      },
      autoUpdate: {
        title: 'Auto update',
        description: 'Dont ask me if I want to update. Just do it and restart app!'
      },
      minimizeToTray: {
        title: 'Minimize prior to closing',
        description: 'Minimize application to tray instead of closing'
      }
    },
    session: {
      session: 'Session',
      timesAttacked: 'Times attacked',
      efficiency: 'Efficiency',
      incomingTraffic: 'Incomming traffic',
      outgoingTraffic: 'Outgoing traffic',
      currentTarget: 'Current target',
      requestsPerMinute: 'Requests per minute'
    },
    statistics: {
      totalAttacks: 'Total attacks',
      rank: {
        name: 'Rank',
        description: 'Make more attacks to receive a higher rank. Only successful attacks matter. (Click on help icon to see all ranks)',
        level: {
          0: 'PTN',
          1: 'Chmonia',
          2: 'Yanukovych',
          3: 'Potato man',
          4: 'Gordon in chocolate',
          5: 'Yushchenko bees',
          6: 'Volunteer',
          7: 'Javelin',
          8: 'Pickled cucumber jar',
          9: 'S-300',
          10: 'NLAW',
          11: 'Bayraktar',
          12: 'Ukrainian gopnik',
          13: 'Teritorial defence',
          14: 'Joe Biden',
          15: 'Andrej Duda',
          16: 'Emmanuel Macron',
          17: 'Boris Johnson',
          18: 'Gypsy with tractor',
          19: 'Ghost of Kyiv',
          20: 'Vitaliy Kim',
          21: 'Stepan Bandera',
          22: 'Oleksiy Arestovych',
          23: 'Valerii Zaluzhnyi',
          24: 'Volodymyr Zelenskyy'
        }
      },
      currentThreads: 'Current threads'
    },
    news: {
      news: 'News'
    }
  }
}
