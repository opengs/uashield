export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataques de DDoS são um método de impedir o funcionamento de páginas web após o envio de diversas solicitações que excedem a capacidade da rede. O servidor de destino ficará lento e a parar de funcionar corretamente',
    coordinators: 'Coordenação de ações https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Número de ataques:',
      currentTarget: 'Objetivo atual: '
    },
    enable: {
      name: 'Ataque DDoS',
      description: 'Habilitar o ataque DDoS em servidores inimigos críticos: governo, sistemas bancários, páginas de propaganda, etc'
    },
    proxy: {
      name: 'Ataque apenas com proxy',
      description: 'Sem esta opção, o programa poderá utilizar o seu IP. Fará um ataque mais eficiente, mas os ataques não serão anônimos.'
    },
    update: {
      title: 'Atualização disponível',
      cancel: 'Cancelar',
      confirm: 'Instalar atualização'
    },
    advanced: {
      header: 'Configurações avançadas',
      description: 'Se alguma terminologia não estiver clara, não altere as configurações avançadas. Pode levar a um efeito negativo e diminuir a eficácia da aplicação',
      masDosersCount: {
        name: 'Nível de processos paralelos',
        description: 'Define a quantidade de processos paralelos. A aplicação depende de operações assíncronas (não paralelas via threads), graças a isto a CPU/RAM não são sobrecarregadas. Uma vez ajustado, geralmente leva cerca de 10 segundos para ajustar a quantidade processos paralelos de acordo com as novas configurações.'
      }
    }
  }
}
