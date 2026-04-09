// preload/index.js — contextBridge IPC API
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),

  // Mini mode — called from renderer to resize window
  setMini: (isMini) => ipcRenderer.send('window-set-mini', isMini),

  // Listen for mini mode changes triggered by drag threshold
  onSetMini: (callback) => {
    ipcRenderer.on('set-mini', (_, value) => callback(value))
    return () => ipcRenderer.removeAllListeners('set-mini')
  }
})
