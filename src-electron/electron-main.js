import { app, BrowserWindow, nativeTheme, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import os from 'os'

import { Engine } from '../src-worker/engine'

import { trackEvent, usr } from './analytics'

const { autoUpdater } = require('electron-updater')

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
const appIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/icon.png'))
const appName = 'UA Cyber SHIELD'

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow
let tray
// default value will be set in Index.vue -> mounted
let minimizeToTray
let isQuite

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
    icon: appIcon,
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

  // Tray constructor requires image as a param, icon is going to be changed later
  tray = new Tray(nativeImage.createEmpty())
  tray.setToolTip(appName)
  tray.setImage(appIcon.resize({ width: 16, height: 16 }))
  // For win platform, open context with click on tray icon
  tray.on('click', () => {
    tray.popUpContextMenu()
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Show ${appName}`,
      click: () => {
        // restore from minimized state
        mainWindow.restore()
        // bring into focus
        mainWindow.show()
      }
    },
    { type: 'separator' },
    {
      label: 'Quite',
      click: () => {
        isQuite = true
        mainWindow.close()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  mainWindow.setMenu(null)
  mainWindow.loadURL(process.env.APP_URL)
  if (process.env.DEBUGGING) {
  // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
    // close window on reload
    isQuite = true
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('systemRunAtStartup', app.getLoginItemSettings().openAtLogin)
  })

  mainWindow.on('close', (event) => {
    if (minimizeToTray && !isQuite) {
      event.preventDefault()
      mainWindow.minimize()
    } else {
      app.quit()
    }
  })

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

  ipcMain.on('updateMinimizeToTray', (event, arg) => {
    minimizeToTray = !!arg.newVal
  })

  ipcMain.on('updateRunAtStartup', (event, arg) => {
    app.setLoginItemSettings({
      openAtLogin: arg.newVal,
      name: appName
    })
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

app.whenReady().then(() => {
  createWindow()
})

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
