export type Working = boolean

declare module 'claude-code' {
  interface PluginState {
    'gamacraft': { isWorking: Working }
  }
}
