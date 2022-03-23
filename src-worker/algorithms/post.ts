import { Method } from 'axios'
import { SimpleHTTP } from './simpleHTTP'

export class Post extends SimpleHTTP {
  get method (): Method {
    return 'POST'
  }
}
