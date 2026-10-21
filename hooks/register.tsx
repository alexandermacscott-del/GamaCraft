import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const GAME_URL = 'https://alexandermacscott-del.github.io/GamaCraft/'

const isWorking = atom({ plugin: 'gamacraft', key: 'isWorking' } as const, false)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'play', description: 'Open Gamacraft, the block game, while Claude works' })

    return next(e)
  })

  on('command.run', { command: 'play' }, async () => {
    return { text: `Gamacraft is ready: ${GAME_URL}` }
  })

  on('turn.start', async ($, e, next) => {
    await update($, isWorking, () => true)

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
