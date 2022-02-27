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
      description: 'Without this option, program will be allowed to use your IP. You will make more efficient atack, but atacks will not be anonymous.'
    }
  }
}
