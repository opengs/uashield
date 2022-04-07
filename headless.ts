import ua from 'universal-analytics'
import uuid4 from 'uuid4'

import { Engine } from './src-worker/engine'

let workers = process.argv[2] ? Number(process.argv[2]) : 32
let useProxy = process.argv[3] !== 'false'

if (process.env.WORKERS) {
  workers = Number(process.env.WORKERS)
}
if (process.env.USEPROXY) {
  useProxy = process.env.USEPROXY === 'true'
}

console.log(`Using ${workers} workers, proxy - ${String(useProxy)}`)

const engine = new Engine()
engine.setExecutorStrategy('automatic')
engine.config.useRealIP = !useProxy
engine.start()

engine.executionStrategy.setExecutorsCount(workers)

const usr = ua('UA-222593827-1', uuid4())

const pageviewFn = () => {
  try {
    usr.pageview('/headless', (err) => {
      if (err) {
        console.log(err)
      }
    })
  } catch (e) { console.log(e) }
}
pageviewFn()
setInterval(pageviewFn, 90000)

process.on('uncaughtException', function (err) {
  console.error(err)
})
