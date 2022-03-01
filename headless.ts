// import { Doser } from './doser';
const {Doser} = require('./src-worker/doser')

const workers = process.argv[2] ? Number(process.argv[2]):  32;
const useProxy = process.argv[3] === 'false' ? false : true;

console.log(`Using ${workers} workers, proxy - ${useProxy}`);

const doser = new Doser(useProxy, workers, false);

doser.listen('atack', (data: any) => console.log(data.log))

doser.loadHostsFile().then(() => {
  doser.start()
}).catch(() => {
  process.exit(1);
})
