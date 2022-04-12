import ua from 'universal-analytics'
import uuid4 from 'uuid4'

import { Engine } from './src-worker/engine'

import { parseArguments } from './src-lib/context'
import { AutomaticStrategy } from './src-worker/planing/automaticStrategy'

const arg = parseArguments()

let workers = (arg.workers !== undefined) ? arg.workers : 32
let useProxy = (arg.withProxy !== undefined) ? arg.withProxy : true

if (process.env.WORKERS) {
  workers = Number(process.env.WORKERS)
}
if (process.env.USEPROXY) {
  useProxy = process.env.USEPROXY === 'true'
}

console.log(`Using ${workers} workers, proxy - ${String(useProxy)}`)

const engine = new Engine()
engine.setExecutorStartegy((arg.planer !== undefined ? arg.planer : 'automatic') as 'manual' | 'automatic')
engine.config.useRealIP = !useProxy
engine.start()

if (engine.executionStartegy.type === 'automatic') {
  (engine.executionStartegy as AutomaticStrategy).setMaxExecutorsCount(arg.maxWorkers !== undefined ? arg.maxWorkers : 128)
}
engine.executionStartegy.setExecutorsCount(workers)

engine.config.logTimestamp = arg.logTimestamp !== undefined ? arg.logTimestamp : true
engine.config.logRequests = arg.logRequests !== undefined ? arg.logRequests : true

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
