import { SimpleHTTP } from './simpleHTTP'

export class Get extends SimpleHTTP {
  get method (): 'GET' {
    return 'GET'
  }
}
