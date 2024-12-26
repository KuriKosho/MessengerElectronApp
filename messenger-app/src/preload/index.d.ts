declare global {
  interface Window {
    context: {
      locale: string
      global: Window
      globalThis: typeof globalThis
    }
  }
}
