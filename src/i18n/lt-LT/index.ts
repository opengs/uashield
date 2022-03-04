export default {
  language: 'Kalba',
  ddos: {
    description: 'DDoS puolimai generuoja daug užklausų tiksliniam priešo serveriui. Atakuojamo serverio veikla pradės strigti.',
    coordinators: 'Koordinatorai: https://discord.gg/7BfJ9JKQ98',
    counter: {
      attackedTimes: 'Kartų užpulta:',
      currentTarget: 'Dabartinis tikslas: '
    },
    enable: {
      name: 'DDoS puolimas',
      description: 'Įgalinkite DDoS atakas prieš svarbius priešo serverius: valstybinius puslapius, banko sistemas, propogandos puslapius ir t.t.'
    },
    proxy: {
      name: 'Pulkite tik naudojant proxy',
      description: 'Be šio pasirinkimo, programa turės galimybę naudoti jūsų IP adresą. Puolimai bus efektyvesni, tačiau atakos nebus anonimiškos.'
    },
    update: {
      title: 'Yra galimas atnaujinimas',
      cancel: 'Atšaukti',
      confirm: 'Įdiegti atnaujinimą'
    },
    advanced: {
      header: 'Išsamūs nustatymai',
      description: 'Jeigu tam tikra terminologija jums yra nesuprantama, geriau nustatymų nekeiskite. Tai gali sukelti neigiamų poveikių ir sumažinti programos efektyvumą.',
      masDosersCount: {
        name: 'Paralelizmo lygis',
        description: 'Apibrėžia procesų kiekį. Programą remiasi ant asinchroninių operacijų (neparalelizmo ant sriegių). Dėl to CPU/RAM nebus perkrautas. Pakoregavus, užtruks apie dešimt sekundžių prisitaikyti prie naujų nustatymų.'
      }
    }
  }
}
