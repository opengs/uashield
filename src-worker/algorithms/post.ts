import { SuperAgentRequest } from 'superagent'
import { PostTarget } from '../external/targetsPool'
import { SimpleHTTP } from './simpleHTTP'
import { getRandomValue } from './utils/randomGenerators'

export class Post extends SimpleHTTP {
  get method (): 'POST' {
    return 'POST'
  }

  protected beforeRequest (agent: SuperAgentRequest, target: PostTarget): SuperAgentRequest {
    agent = agent.set('Content-Type', 'application/json')
    agent = agent.send(this.makeRequestBody(target))
    return agent
  }

  protected makeRequestBody (target: PostTarget): string | undefined {
    let body = target.body

    if (typeof body !== 'string') {
      return undefined
    }

    if (Array.isArray(target.randomGenerators)) {
      for (const generator of target.randomGenerators) {
        if (typeof generator.name === 'string') {
          body = body.replace(`%%%${generator.name}%%%`, () => getRandomValue(generator))
        }
      }
    }

    return body
  }
}
