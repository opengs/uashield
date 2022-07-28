import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export function parseArguments () {
  return yargs(hideBin(process.argv)).options({
    ip: { type: 'string', default: undefined, description: 'Your ip' },
    startDDoS: { type: 'boolean', default: undefined, description: 'Immediatelly start DDoS (only for GUI version)' },
    logTimestamp: { type: 'boolean', default: undefined, description: 'Show timestamp in logs' },
    logRequests: { type: 'boolean', default: undefined, description: 'Log every request status' },
    withProxy: { type: 'boolean', default: undefined, description: 'Use proxy for DDoS' },
    planer: { choices: ['manual', 'automatic'], default: undefined, description: 'Execution planer to use. Automatic planer adjust number of workers on the fly' },
    maxWorkers: { type: 'number', default: undefined, description: 'Maximum number of workers (threads) to use' },
    workers: { type: 'number', default: undefined, description: 'Initial number of workers (threads)' }
  }).help().parseSync()
}
