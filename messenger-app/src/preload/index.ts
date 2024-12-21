import { contextBridge } from 'electron'

window.global = window
global.global = globalThis
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    global: window,
    globalThis: globalThis
  })
} catch (error) {
  console.error(error)
}
