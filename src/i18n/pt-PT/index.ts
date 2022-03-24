export default {
  language: 'Idioma',
  ddos: {
    description: 'Ataques de DDoS são métodos que tornam os recursos de um sistema indisponíveis para os seus utilizadores através de diversas solicitações que excedem a capacidade da rede',
    coordinators: 'Coordenação de ações: https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Número de ataques:',
      currentTarget: 'Objetivo atual: '
    },
    efficiency: 'Eficiência',
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
      automaticMode: {
        name: 'Modo automático',
        description: 'Quando habilitado, o programa analisa a eficácia e seleciona automaticamente o nível de processos paralelos.'
      },
      masDosersCount: {
        name: 'Nível de processos paralelos',
        description: 'Define a quantidade de processos paralelos. São mecanismos assíncronos para não sobrecarregar a CPU / RAM. Uma vez ajustado, leva cerca de 10 segundos para assumir as novas configurações.'
      }
    }
  }
}
