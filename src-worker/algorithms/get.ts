import { Method } from 'axios'
import { SimpleHTTP } from './simpleHTTP'

export class Get extends SimpleHTTP {
  get method (): Method {
    return 'GET'
  }
}
