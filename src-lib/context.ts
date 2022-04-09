import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export function parseArguments () {
  return yargs(hideBin(process.argv)).options({
    startDDoS: { type: 'boolean', default: true, description: 'Immediatelly start DDoS (only for GUI version)' },
    logTimestamp: { type: 'boolean', default: true, description: 'Show timestamp in logs' },
    logRequests: { type: 'boolean', default: true, description: 'Log every request status' },
    withProxy: { type: 'boolean', default: true, description: 'Use proxy for DDoS' },
    planer: { choices: ['manual', 'automatic'], default: 'automatic', description: 'Execution planer to use. Automatic planer adjust number of workers on the fly' },
    maxWorkers: { type: 'number', default: 256, description: 'Maximum number of workers (threads) to use' },
    workers: { type: 'number', default: 32, description: 'Initial number of workers (threads)' }
  }).help().parseSync()
}
