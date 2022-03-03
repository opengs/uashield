# How to add a new language to the program interface

So, you want to add a new language to the program, just create a Pull Request with the following changes:

1. Add a languange to the selector: [../src/components/LanguageSelect.vue](../src/components/LanguageSelect.vue), example:

```javascript
  {
    name: 'Español',
    symbol: 'es-ES',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAoSIAANbYAExW0yVAAAAp0lEQVQ4y2NgGHBwjFvuPyV4EBjw/wjDf3T8+yDjf2zi2DCKAT8PMP0/WML/f0u+8P+Xa1hJN+DKEtH/S4J4/q+tjvx/fb3p/w+72Ik34O8Bhv+Hq0z+d9nJ/59eUPr/aHfY/+crhEgw4CDD/1PLTP+viuP+vyZc4v/pXo3/z9YLkeaFR9sk/n/cxfP/+SaJ/2938/3/tI+LsAHHuWX/U4IHQUIacAAATr27n7zDjuMAAAAASUVORK5CYII='
  },
```

Copy-paste the following block of code and replace all values.
You can download an icon from iconscout website in png format ([example](https://iconscout.com/icon/spain-flag-country-nation-union-empire)) and convert it to base64, for example [here](https://onlinepngtools.com/convert-png-to-base64)

2. Create a new folder in [../src/i18n/](../src/i18n/), copy-paste `index.ts` file from another directory and translate all values to the new language

3. Eventually add changes to the file [../src/i18n/index.ts](../src/i18n/index.ts), for example:

```javascript
...
import esES from './es-ES'

export default {
...
  'es-ES': esES
}
```

1. If you are able to build an app from [source code](../README-en.md#how-to-build-from-source-code) it could be tested as well
