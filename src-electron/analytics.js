import ua from 'universal-analytics'

import uuid4 from 'uuid4'
import {machineIdSync} from 'node-machine-id';

function makeId() {
  try {
    return machineIdSync()
  } catch {
    return uuid4()
  }
}

export const usr = ua('UA-222593827-1', makeId())

export function trackEvent (category, action, label, value) {
  const r = usr.event({ ec: category, ea: action, el: label, ev: value }).send()
  console.log(r)
}
