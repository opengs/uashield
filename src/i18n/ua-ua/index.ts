export default {
  language: 'Мова',
  ddos: {
    description: 'Атака DDoS робить величезну кількість запитів на ворожі сайти, чим спричиняє їхню величезну завантаженість і виводить їх з ладу. В наслідку атаки DDoS, сервери не можуть працювати в штатному режимі / лагають, або взагалі не працюють.',
    coordinators: 'Для координацій цілей: https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: 'Атаковано разів:',
      currentTarget: 'Теперішня ціль:'
    },
    enable: {
      name: 'Атака DDoS',
      description: 'Вмикає атаку DDoS по основним системам ворога: урядові сайти, банківські системи, пропагандиські пабліки, тощо. Поточні цілі атаки відображаються на сторінці'
    },
    proxy: {
      name: 'Атакувати тільки через проксі',
      description: 'З атакою без проксі, програма зможе використовувати ваш реальний IP. Це дозволяє робити атаки більш ефективними, але водночас зробить ваш IP відомим ворогу'
    },
    advanced: {
      header: 'Extended settings',
      description: 'If some terminology is not clear for you, please do not change extended settings. It can lead to negative effect and decrease effectiveness of the application',
      masDosersCount: {
        name: 'Level of parallelism',
        description: 'Defines amount of parallel processes. Application relies on asynchronous operations (not parallel via threads), thanks to that CPU/RAM are not overloaded. Once adjusted, it will usually take around 10 seconds to adjust amount of dosers according to new settings.'
      }
    },
    update: {
      title: 'Оновлення доступне',
      cancel: 'Відміна',
      confirm: 'Встановити оновлення'
    }
  }
}
