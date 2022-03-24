// This code was developed and provided by Mykola Grybyk
// https://github.com/mgrybyk/uasword

import os from 'os'

import { chromium, Browser, BrowserContext, Dialog } from 'playwright-core'

import { sleep } from '../../helpers'

let browser = null as Browser | null
const freemem = os.freemem() / (1024 * 1024 * 1024)
const MAX_BROWSER_CONTEXTS = Math.floor(freemem * 4)
let activeContexts = 0

export const runBrowser = async () => {
  if (browser !== null) {
    return
  }

  try {
    // try install browser to make update easier for existing users. Safe to remove in 2 weeks.
    /* if (!process.env.IS_DOCKER) {
      try {
        let cli = require('playwright-core/lib/utils/registry')
        let executables = [cli.registry.findExecutable('chromium')]
        await cli.registry.installDeps(executables, false)
        await cli.registry.install(executables)
        executables.length = 0
        executables = null
        cli = null
      } catch {
        console.log('Failed to install browser or deps')
      }
    } */

    browser = await chromium.launch()
    console.log('Max browser contexts', MAX_BROWSER_CONTEXTS)
  } catch {
    console.log('WARN: Unable to use real browser to overcome protection.')
    browser = null
  }
}

export const isAvailable = () => {
  return browser !== null
}

export const pw = async (baseURL: string) => {
  if (!browser) {
    return null
  }

  // eslint-disable-next-line no-unmodified-loop-condition
  while (activeContexts >= MAX_BROWSER_CONTEXTS || os.freemem() < 524288000) {
    await sleep(1000)
  }
  activeContexts++

  let context
  try {
    context = await browser.newContext({ baseURL })
    await abortBlocked(context)
    const page = await context.newPage()
    const acceptDialog = (dialog: Dialog) => void dialog.accept()
    page.once('dialog', acceptDialog)
    await page.goto('', { timeout: 15000 })
    await sleep(5000)
    const storageState = await page.context().storageState()
    await page.close()
    return storageState.cookies
      .reduce<string[]>((prev, { name, value }) => {
        prev.push(`${name}=${value};`)
        return prev
      }, [])
      .join(' ')
  } catch {
    return null
  } finally {
    activeContexts--
    if (context) {
      await context.close()
    }
  }
}

const blacklist = [
  /.*\.jpg/,
  /.*\.jpeg/,
  /.*\.svg/,
  /.*\.ico/,
  /.*\.json/,
  /.*\.png/,
  /.*\.woff/,
  /.*\.woff\?.*/,
  /.*\.ttf/,
  /.*\.woff2/,
  /.*\.css/,
  /.*\.css\?.*/,
  /.*googleapis\.com\/.*/,
  /.*twitter\.com\/.*/,
  /.*\/themes\/.*/,
  /.*drupal\.js.*/,
  /.*jquery.*/,
  /.*jcaption.*/,
  /.*webform.*/,
  /.*doubleclick\.net\/.*/,
  /.*twimg\.com\/.*/,
  'https://www.youtube.com/**',
  'https://i.ytimg.com/**',
  'https://maps.google.com/**',
  'https://translate.google.com/**',
  'https://consent.cookiebot.com/**'
]

const abortBlocked = async (ctx: BrowserContext) => {
  for (const url of blacklist) {
    await ctx.route(url, (r) => void r.abort())
  }
}
