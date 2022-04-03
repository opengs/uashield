import { SimpleHTTP } from './simpleHTTP'

export class Post extends SimpleHTTP {
  get method (): 'POST' {
    return 'POST'
  }
}
