// import { Doser } from './doser';
const { Doser } = require('./src-worker/doser')

let workers = process.argv[2] ? Number(process.argv[2]) : 32
let useProxy = process.argv[3] === 'false' ? false : true
let dnsWorkers = process.argv[4] ? Number(process.argv[4]) : 0

if (process.env.WORKERS) {
  workers = Number(process.env.WORKERS)
}
if (process.env.USEPROXY) {
  useProxy = process.env.USEPROXY === 'true'
}
if (process.env.DNS_WORKERS) {
  dnsWorkers = Number(process.env.DNS_WORKERS)
}

console.log(`Using ${workers} workers, ${dnsWorkers} dns workers, proxy - ${useProxy}`)

const doser = new Doser(useProxy, workers, dnsWorkers)

doser.listen('atack', (data: any) => console.log(data.log))

doser.start()
