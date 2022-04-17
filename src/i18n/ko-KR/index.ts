export default {
  language: '언어',
  ddos: {
    description: 'DDoS 공격은 대상 적 서버에 엄청난 수의 요청을 하여 과도한 로드를 유발합니다. 결과적으로 서버가 모든 요청을 처리할 수 없기 때문에 평상시처럼 작동하지 못하고 지연되거나 아예 작동을 중지합니다. 여기에서 세부정보: https://help-ukraine-win.com.ua/',
    coordinators: '조정의 경우: https://discord.gg/7BfJ9JKQ98 ',
    counter: {
      attackedTimes: '공격 횟수:',
      currentTarget: '현재 대상: '
    },
    enable: {
      name: '디도스(DDoS) 공격',
      description: '이는 정부 웹 사이트, 은행 시스템, 선전 리소스 등 중요한 적 리소스에 대한 DDoS 공격을 지원합니다.'
    },
    proxy: {
      name: '프록시만 사용하여 공격하기',
      description: '이 옵션이 없으면 프로그램에서 시스템의 실제 IP 주소를 사용할 수 있습니다. 이러면 공격이 훨씬 더 효율적으로 수행되지만 공격이 익명으로 수행되지 않고 적에게 사용자의 IP 주소가 표시됩니다.'
    },
    update: {
      title: '사용 가능한 업데이트',
      cancel: '취소',
      confirm: '업데이트 다운받기'
    },
    advanced: {
      header: '확장 설정',
      description: '용어가 명확하지 않은 경우 확장 설정을 변경하지 마십시오. 그것은 부정적인 효과로 이어질 수 있고 애플리케이션의 효과를 감소시킬 수 있습니다.',
      masDosersCount: {
        name: '병렬화 수준',
        description: '공격 프로세스의 수를 정의합니다. CPU/RAM이 과부하가 되지 않기 때문에 앱은 스레드를 통한 병렬이 아닌 비동기 작업에 의존합니다. 조정 후 새로운 설정에 따라 공격 처리량을 조정하는 데 보통 10초 정도 걸립니다.'
      }
    }
  }
}
