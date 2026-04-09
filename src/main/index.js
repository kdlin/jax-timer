// main/index.js — Electron main process
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// Track mini mode state in main process
let isMiniMode = false

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 380,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    minWidth: 192,
    minHeight: 100,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // ─── Drag to resize → threshold snap ───────────────────────────────────────
  // When user drags the window below 250px wide, snap to mini mode (192x120)
  // When they drag back above 250px, snap back to full size (320x380)
  win.on('will-resize', (event, newBounds) => {
    if (newBounds.width < 250 && !isMiniMode) {
      event.preventDefault()
      isMiniMode = true
      win.setSize(192, 120)
      win.webContents.send('set-mini', true)
    } else if (newBounds.width >= 250 && isMiniMode) {
      event.preventDefault()
      isMiniMode = false
      win.setSize(320, 380)
      win.webContents.send('set-mini', false)
    }
  })

  // ─── IPC Handlers ───────────────────────────────────────────────────────────

  // Minimize the window to taskbar
  ipcMain.on('window-minimize', () => {
    win.minimize()
  })

  // Close / quit the app
  ipcMain.on('window-close', () => {
    app.quit()
  })

  // Toggle mini mode from renderer (button click)
  ipcMain.on('window-set-mini', (_, mini) => {
    isMiniMode = mini
    if (mini) {
      win.setSize(192, 120)
    } else {
      win.setSize(320, 380)
    }
    // Confirm back to renderer so React state stays in sync
    win.webContents.send('set-mini', mini)
  })

  // Load dev server or built files
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.jax-timer')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
