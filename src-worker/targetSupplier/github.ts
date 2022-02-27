import request from 'superagent'
import TargetSuplier, { TargetInfo } from './supplier'

const _TARGETS_FILE = ''

export default class GithubSupplier extends TargetSuplier {
  async _getFromGithub () {
    const r = await request.get(_TARGETS_FILE).set('Accept', 'application/json')
    return r.body as Array<TargetInfo>
  }

  async findNext () {
    const targets = await this._getFromGithub()
    targets.sort((a, b) => a.timestamp - b.timestamp)
    const currentTimestamp = Math.round((new Date()).getTime() / 1000)
    let targetIndex = 0
    for (let index = 0; index < targets.length; index++) {
      if (currentTimestamp < targets[index].timestamp) {
        targetIndex = index
      } else {
        break
      }
    }

    return targets[targetIndex]
  }
}
