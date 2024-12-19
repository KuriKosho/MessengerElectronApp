/// <reference types="vite/client" />

interface Window {
  context: {
    locale: string
    window: {
      close: () => void
      minimize: () => void
      maximize: () => void
    }
  }
}
