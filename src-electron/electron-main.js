import { app, BrowserWindow, nativeTheme, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import os from 'os'

import { Engine } from '../src-worker/engine'
import { parseArguments } from '../src-lib/context'

import { trackEvent, usr } from './analytics'

import Store from 'electron-store'
Store.initRenderer()

import { USER_DATA_KEY, defaultData } from '../src-lib/storage'

const storage = new Store({
  migrations: {
    '1.0.1': store => {
      const data = store.get(USER_DATA_KEY, defaultData)
      data.settings.minimizeToTray = true
      // data.settings.ip = publicIpv4()
      store.set(USER_DATA_KEY, data)
    }
  }
})

ipcMain.handle('loadUserData', (e) => {
  const data = storage.get(USER_DATA_KEY, defaultData)
  console.log(data)
  return data
});

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
let isQuit

const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function getLocalExternalIP () { 
  var ifaces = os.networkInterfaces();
    let ipAdresse = {};
    Object.keys(ifaces).forEach(function (ifname) {
      let alias = 0;
      ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
    // this single interface has multiple ipv4 addresses
    console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      ipAdresse = {IP: iface.address, MAC: iface.mac};
      }
      ++alias;
    });
  });
  return ipAdresse;
}

function sendStatusToWindow (text) {
  try {
    console.log(text)
  } catch (err) {
    console.log(err)
  }
}
function createWindow () {
  usr.pageview('/', function (err) {
    console.log('pageview')
    console.log(err)
  })
  setInterval(() => {
    try {
    usr.pageview('/', function (err) {
    console.log('pageview')
    console.log(err)
    })
  } catch (e) { console.log(e) }}
  , 90000)

  console.log('Parsing arguments')

  const arg = parseArguments()

  console.log('Applying parsed arguments')

  // Load arguments and save to the storage
  const storageData = storage.get(USER_DATA_KEY, defaultData)

  if (arg.startDDoS !== undefined) storageData.ddos.enabled = arg.startDDoS
  if (arg.maxWorkers !== undefined) storageData.ddos.maxWorkers = arg.maxWorkers
  if (arg.workers !== undefined) storageData.ddos.workers = arg.workers
  if (arg.planer !== undefined) storageData.ddos.planer = arg.planer
  if (arg.withProxy !== undefined) storageData.ddos.withProxy = arg.withProxy
  if (arg.logRequests !== undefined) storageData.settings.log.requests = arg.logRequests
  if (arg.logTimestamp !== undefined) storageData.settings.log.timestamp = arg.logTimestamp

  // Set autorun
  if (storageData.settings.autoLaunch === undefined) {
    app.setLoginItemSettings({ openAtLogin: true })
    storageData.settings.autoLaunch = true
  }

  storage.set(USER_DATA_KEY, storageData)

  const engine = new Engine()
  engine.config.useRealIP = !storageData.ddos.withProxy
  engine.config.logRequests = storageData.settings.log.requests
  engine.config.logTimestamp = storageData.settings.log.timestamp
  engine.setExecutorStartegy(storageData.ddos.planer)
  engine.executionStartegy.setExecutorsCount(storageData.ddos.workers)
  if (engine.executionStartegy.type === 'automatic') {
    engine.executionStartegy.setMaxExecutorsCount(storageData.ddos.maxWorkers)
  }

  mainWindow = new BrowserWindow({
    icon: appIcon.resize({ width: 32, height: 32 }),
    width: 1150,
    height: 650,
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
  tray.setImage(appIcon)
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
      label: 'Quit',
      click: () => {
        isQuit = true
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
    isQuit = true
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
    if (storageData.settings.minimizeToTray && !isQuit && !mainWindow.isMinimized()) {
      event.preventDefault()
      mainWindow.minimize()
    } else {
      app.quit()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const window = mainWindow

  engine.executionStartegy.on('atack', (data) => window.webContents.send('atack', data))
  engine.executionStartegy.on('error', (data) => window.webContents.send('error', data))
  engine.executionStartegy.on('automatic_executorsCountUpdate', (data) => window.webContents.send('executorsCountUpdate', data))

  mainWindow.webContents.on('did-finish-load', () => {
    window.webContents.send('programArgs', arg)
  })

  // const doser = new Doser(true, 32)
  // const window = mainWindow
  // doser.listen('atack', (data) => console.log(data.log))
  // doser.listen('atack', (data) => window.webContents.send('atack', data))
  // doser.listen('error', (data) => window.webContents.send('error', data))
  // doser.start()

  if (storageData.ddos.enabled) {
    engine.start()
  }

  ipcMain.on('statisticsDDoSAddRequests', (event, arg) => {
    storageData.statistics.ddos.allTimeRequests += arg.allTimeRequests
    storageData.statistics.ddos.allTimeSuccessfullRequests += arg.allTimeSuccessfullRequests
    storageData.statistics.ddos.allTimeNeutralRequests += arg.allTimeNeutralRequests
    storage.set(USER_DATA_KEY, storageData)
  })

  ipcMain.on('ddosUpdateEnabled', (event, arg) => {
    storageData.ddos.enabled = arg.newValue
    storage.set(USER_DATA_KEY, storageData)

    if (arg.newValue) {
      engine.start()
    } else {
      engine.stop()
    }
  })

  ipcMain.on('ddosUpdateWithProxy', (event, arg) => {
    storageData.ddos.withProxy = arg.newValue
    storage.set(USER_DATA_KEY, storageData)
    engine.config.useRealIP = !arg.newValue
  })

  ipcMain.on('ddosUpdatePlaner', (event, arg) => {
    storageData.ddos.planer = arg.newValue
    storageData.ddos.maxWorkers = 128
    storageData.ddos.workers = 32
    storage.set(USER_DATA_KEY, storageData)

    engine.setExecutorStartegy(arg.newValue)
    engine.executionStartegy.on('atack', (data) => window.webContents.send('atack', data))
    engine.executionStartegy.on('error', (data) => window.webContents.send('error', data))
    engine.executionStartegy.on('automatic_executorsCountUpdate', (data) => window.webContents.send('executorsCountUpdate', data))
  })

  ipcMain.on('ddosUpdateMaxWorkers', (event, arg) => {
    storageData.ddos.maxWorkers = arg.newValue
    storage.set(USER_DATA_KEY, storageData)

    if (engine.executionStartegy.type === 'automatic') {
      engine.executionStartegy.setMaxExecutorsCount(arg.newValue)
    }
  })

  ipcMain.on('ddosUpdateWorkers', (event, arg) => {
    storageData.ddos.workers = arg.newValue
    storage.set(USER_DATA_KEY, storageData)

    if (engine.executionStartegy.isRunning) {
      engine.executionStartegy.setExecutorsCount(arg.newValue)
    }
  })

  ipcMain.on('installUpdate', () => {
    autoUpdater.quitAndInstall()
  })

  // Settings
  ipcMain.on('settingsSetLanguage', (_ev, value) => {
    storageData.settings.language = value
    storage.set(USER_DATA_KEY, storageData)
  })
  ipcMain.on('settingsSetAutoLaunch', (_ev, value) => {
    storageData.settings.autoLaunch = value
    app.setLoginItemSettings({ openAtLogin: value, name: appName })
    storage.set(USER_DATA_KEY, storageData)
  })
  ipcMain.on('settingsSetAutoUpdate', (_ev, value) => {
    storageData.settings.autoUpdate = value
    storage.set(USER_DATA_KEY, storageData)
  })
  ipcMain.on('settingsSetMinimizeToTray', (event, value) => {
    storageData.settings.minimizeToTray = value
    storage.set(USER_DATA_KEY, storageData)
  })
  ipcMain.on('settingsSetLogTimestamp', (_ev, value) => {
    storageData.settings.log.timestamp = value
    engine.config.logTimestamp = value
    storage.set(USER_DATA_KEY, storageData)
  })
  ipcMain.on('settingsSetLogRequests', (_ev, value) => {
    storageData.settings.log.requests = value
    engine.config.logRequests = value
    storage.set(USER_DATA_KEY, storageData)
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
    if (storage.get(USER_DATA_KEY, defaultData)?.settings?.autoUpdate) {
      autoUpdater.quitAndInstall()
    } else {
      mainWindow?.webContents.send('update', obj)
    }
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

process.on('uncaughtException', function (err) {
  console.error(err)
})
