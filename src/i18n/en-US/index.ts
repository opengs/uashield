export default {
  language: 'Language',
  layout: {
    header: {
      dashboard: 'Dashboard',
      ddos: 'DDoS',
      bruteforce: 'Brute force',
      bomber: 'Bomber',
      statistics: 'Statistics',
      settings: 'Settings'
    },
    menu: {
      dashboard: {
        title: 'Dashboard',
        caption: 'General view'
      },
      ddos: {
        title: 'DDoS',
        caption: 'Denial of service attack'
      },
      bruteforce: {
        title: 'Brute Force',
        caption: 'Cracking enemy passwords'
      },
      bomber: {
        title: 'Bomber',
        caption: 'Bombarding with SMS and calls'
      },
      statistics: {
        title: 'Statistics',
        caption: 'My statistics'
      },
      settings: {
        title: 'Settings',
        caption: 'Global settings'
      }
    }
  },
  dashboard: {
    rank: {
      header: 'Your rank in is'
    },
    totalDDoSAtacks: {
      header: 'Total successfull DDoS attacks count'
    },
    currentWorkers: {
      header: 'Current threads'
    },
    efficiency: {
      header: 'DDoS efficiency',
      allTimeEfficiency: 'All time efficiency',
      currentEfficiency: 'Current efficiency',
      workers: 'Threads'
    },
    requestsPerMinute: {
      header: 'Requests per minute',
      failedRequests: 'Failed',
      successfullRequest: 'Success',
      neutralRequests: 'Neutral (unknown)'
    }
  },
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
      maxWorkersCount: {
        name: 'Max threads count',
        description: 'Maximum possible count of threads'
      },
      automaticMode: {
        name: 'Automatic mode',
        description: 'When enabled, program analizes efficiency and automatically selects level of parallelism'
      },
      masDosersCount: {
        name: 'Number of threads',
        description: 'Defines the number of attack processes. The application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust the amount of the attack processes according to new settings.'
      }
    }
  },
  bomber: {
    header: 'Phone bomber',
    description: 'Bomber sends SMS and makes phone calls to the target. You must have enabled VPN for this attack. Remember, that while everyone uses bomber, efficiency may be very low.',
    running: {
      title: 'Attack enabled',
      caption: 'Start or stop attack'
    },
    successFullAttacks: 'Successfull attacks: ',
    failedAttacks: 'Failed attacks: '
  },
  statistics: {
    rank: {
      title: 'Rank',
      caption: 'Make more attacks to receive a higher rank. Only successful attacks matter',
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
    }
  },
  settings: {
    autoLaunch: {
      title: 'Auto launch (Windows / MacOS)',
      caption: 'Launch application on start up'
    },
    logRequests: {
      title: 'Log requests',
      caption: 'Dump status of every request to the log'
    },
    logTimestamps: {
      title: 'Log timestamp',
      caption: 'Log timestamp with logger message'
    },
    autoUpdate: {
      title: 'Auto update',
      caption: 'Dont ask me if I want to update. Just do it and restart app!'
    },
    minimizeToTray: {
      title: 'Minimize to tray',
      caption: 'Minimize application to tray instead of closing'
    }
  }
}
