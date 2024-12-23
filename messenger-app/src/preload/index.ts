import { contextBridge } from 'electron'
// const ZegoExpressEngine = require('zego-express-engine-electron/ZegoExpressEngine')

window.global = window
global.global = globalThis
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}
// contextBridge.exposeInMainWorld('zego', {
//   engine: new ZegoExpressEngine()
// })
try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    global: window,
    globalThis: globalThis
  })
} catch (error) {
  console.error(error)
}
