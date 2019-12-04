import readline from 'readline'
import { Store } from 'redux'
import { State } from './store/state'
import { Action } from './store/action'
import * as actions from './store/action'

readline.emitKeypressEvents(process.stdin)

export const registerKeypress = ({
  store,
}: {
  store: Store<State, Action>
}) => {
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true)
  }

  process.stdin.on('keypress', (chunk, key) => {
    // RawMode own kill switch
    if (key.sequence === '\u0003') {
      process.exit()
    }

    store.dispatch(actions.onKeypress(chunk, key))
  })
}
