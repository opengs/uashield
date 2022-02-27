export default {
  ddos: {
    description: 'DDOS atack makes a lot of reqquests to the target enemy server. Target servers will start to lag and stop working properly.',
    counter: {
      atackedTimes: 'Times atacked:',
      currentTarget: 'Current target: '
    },
    enable: {
      name: 'DDOS atack',
      description: 'Enable DDOS atack on critical enemy servers: goverment, banking systems, propaganda webpages, ...'
    },
    proxy: {
      name: 'Atack only using proxy',
      description: 'Atack only using proxy servers and hide my real IP. Makes atacks less efficient but anoanonymous. Without this option, program choses best strategy on the fly.'
    }
  }
}
