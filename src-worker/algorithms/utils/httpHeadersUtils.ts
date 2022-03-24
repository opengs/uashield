import UserAgent from 'user-agents'
import { Random } from './random'

export class HttpHeadersUtils {
  public static generateRequestHeaders () {
    const baseHeaders = {
      ...HttpHeadersUtils.userAgent(),
      ...HttpHeadersUtils.accept(),
      ...HttpHeadersUtils.acceptLanguage()
    }
    const randomHeaders = HttpHeadersUtils.getAdditionalRandomHeaders()
    return { ...baseHeaders, ...randomHeaders }
  }

  private static getAdditionalRandomHeaders () {
    let headers = {}
    if (Random.bool()) {
      headers = { ...headers, ...HttpHeadersUtils.referer() }
    }
    if (Random.bool()) {
      headers = { ...headers, ...HttpHeadersUtils.cacheControl() }
    }
    if (Random.bool()) {
      headers = { ...headers, ...HttpHeadersUtils.upgradeInsecureRequest() }
    }
    if (Random.bool()) {
      headers = { ...headers, ...HttpHeadersUtils.acceptEncoding() }
    }
    if (Random.bool()) {
      headers = { ...headers, ...HttpHeadersUtils.secHeaders() }
    }
    return headers
  }

  private static acceptEncoding () {
    return {
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }

  private static upgradeInsecureRequest () {
    return {
      'Upgrade-Insecure-Requests': 1
    }
  }

  private static acceptLanguage () {
    const options = [
      'ru-RU,ru',
      'ru,en;q=0.9,en-US;q=0.8'
    ]
    return { 'Accept-Language': options[Random.int(options.length)] }
  }

  private static secHeaders () {
    return {
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-dest': 'document',
      'sec-fetch-user': '?1',
      'sec-ch-ua-platform': 'Windows',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"'
    }
  }

  private static accept () {
    return {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    }
  }

  private static userAgent () {
    const agent: UserAgent = new UserAgent()
    return {
      'User-Agent': agent.toString()
    }
  }

  private static cacheControl () {
    const options = [
      'no-cache',
      'max-age=0'
    ]
    return { 'Cache-Control': options[Random.int(options.length)] }
  }

  private static referer () {
    const options = [
      'https://www.google.com/',
      'https://vk.com/',
      'https://go.mail.ru/search/',
      'https://yandex.ru/search/',
      'https://yandex.ru/search/'// don't remove the second line this is on purpose
    ]
    return { Referer: options[Random.int(options.length)] }
  }
}
