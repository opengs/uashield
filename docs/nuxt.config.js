import theme from '@nuxt/content-theme-docs'
import path from 'path'
export default theme({
  docs: {
    primaryColor: '#E24F55'
  },
  i18n: {
    locales: () => [{
      code: 'ua',
      iso: 'ua-ua',
      file: 'ua-ua.js',
      name: 'український'
    }, {
      code: 'en',
      iso: 'en-US',
      file: 'en-US.js',
      name: 'English'
    }],
    defaultLocale: 'en',
    langDir: path.resolve('./locales')
  }
})
