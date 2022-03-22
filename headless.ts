// import { Doser } from './doser';
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
engine.setExecutorStartegy('automatic')
engine.config.useRealIP = !useProxy
engine.start()

engine.executionStartegy.setExecutorsCount(workers)
