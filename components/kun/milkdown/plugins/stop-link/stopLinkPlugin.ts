import { $command, $useKeymap } from '@milkdown/utils'
import { linkSchema } from '@milkdown/preset-commonmark'
// import { spoilerSchema } from '../spoiler/spoilerPlugin'
import { commandsCtx } from '@milkdown/core'
import type { MarkType } from '@milkdown/kit/prose/model'
import type { EditorState } from '@milkdown/prose/state'

const hasMark = (state: EditorState, type: MarkType) => {
  if (!type) {
    return false
  }
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks())
  }
  return state.doc.rangeHasMark(from, to, type)
}

export const stopLinkCommand = $command('StopLink', (ctx) => () => {
  return (state, dispatch) => {
    const markType = linkSchema.type(ctx)
    const checkMark = hasMark(state, markType)
    if (checkMark) {
      dispatch?.(state.tr.removeStoredMark(markType))
    }
    return false
  }
})

// export const stopLinkCommand = $command('StopLink', (ctx) => () => {
//   return (state, dispatch) => {
//     const linkMarkType = linkSchema.type(ctx)
//     const spoilerMarkType = spoilerSchema.type(ctx)

//     const checkLinkMark = hasMark(state, linkMarkType)
//     const checkSpoilerMark = hasMark(state, spoilerMarkType)
//     if (checkLinkMark) {
//       dispatch?.(state.tr.removeStoredMark(linkMarkType))
//     }
//     if (checkSpoilerMark) {
//       dispatch?.(state.tr.removeStoredMark(spoilerMarkType))
//     }
//     return false
//   }
// })

export const linkCustomKeymap = $useKeymap('linkCustomKeymap', {
  StopLink: {
    shortcuts: ['Space'],
    command: (ctx) => {
      const commands = ctx.get(commandsCtx)
      return () => commands.call(stopLinkCommand.key)
    }
  }
})
