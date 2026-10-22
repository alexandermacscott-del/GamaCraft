import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

const GAME_URL = 'https://alexandermacscott-del.github.io/GamaCraft/'

// Don't pop the game open again if it was opened this recently
const REOPEN_AFTER_MS = 20 * 60 * 1000

// One opener per platform; the first that starts wins
const OPENERS: readonly (readonly string[])[] = [
  ['cmd', '/c', 'start', '', GAME_URL], // Windows
  ['open', GAME_URL], // macOS
  ['xdg-open', GAME_URL], // Linux
]

const isWorking = atom({ plugin: 'gamacraft', key: 'isWorking' } as const, false)

async function openGame($: EngineInterface): Promise<boolean> {
  for (const argv of OPENERS) {
    try {
      const { exitCode } = await $.process.run(argv, { timeoutMs: 10000 })
      if (exitCode === 0) {
        await $.store.set('lastOpenedAt', await $.clock.now())

        return true
      }
    } catch {
      // this opener isn't on this computer; try the next
    }
  }

  return false
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'play',
      description: 'Open Gamacraft now. "/play off" stops it opening by itself, "/play on" turns that back on',
    })

    return next(e)
  })

  on('command.run', { command: 'play' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'off') {
      await $.store.set('autoOpen', false)

      return { text: 'Gamacraft won\'t open by itself anymore. Type /play to open it, or /play on to turn auto-open back on.' }
    }
    if (arg === 'on') {
      await $.store.set('autoOpen', true)

      return { text: 'Gamacraft will open by itself when Claude starts working (at most every 20 minutes).' }
    }

    const opened = await openGame($)

    return { text: opened ? `Opened Gamacraft: ${GAME_URL}` : `Gamacraft is here: ${GAME_URL}` }
  })

  on('turn.start', async ($, e, next) => {
    await update($, isWorking, () => true)

    const autoOpen = (await $.store.get('autoOpen')) !== false
    const lastOpenedAt = Number((await $.store.get('lastOpenedAt')) ?? 0)
    if (autoOpen && (await $.clock.now()) - lastOpenedAt > REOPEN_AFTER_MS) {
      // don't hold up Claude's turn while the browser starts
      void openGame($).catch(() => undefined)
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await update($, isWorking, () => false)

    return next(e)
  })

  on('turn.abort', async ($, e, next) => {
    await update($, isWorking, () => false)

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await read($, isWorking))) {
      return next(e)
    }

    const { Box, Text, Link } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>Claude is working. </Text>
        <Link href={GAME_URL} label="Play Gamacraft" />
      </Box>
    )
  })
}
