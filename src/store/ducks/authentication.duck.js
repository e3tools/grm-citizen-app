import {Map} from 'immutable'
import {createActions, handleActions} from 'redux-actions'
import {getEncryptedData, storeEncryptedData} from '../../utils/storageManager'
import {client} from '../../utils/request'
import config from '../../../config'

const defaultState = Map({
  session: null,
  profile: null,
})

function storeSessionData(sessionObject) {
  storeEncryptedData(config.USER_SESSION_KEY, JSON.stringify(sessionObject))
}

export async function getSessionData() {
  const sessionData = await getEncryptedData(config.USER_SESSION_KEY)
  return sessionData ? JSON.parse(sessionData) : null
}

export function addTokenToHttpClient(sessionObject) {
  client.defaults.headers.common['Authorization'] =
    `Token ${sessionObject.token}`
}
export const {signUp, login} = createActions({
  LOGIN: session => {
    addTokenToHttpClient(session)
    storeSessionData(session)
    return {
      session,
    }
  },
  SIGN_UP: () => {},
})

const authentication = handleActions(
  {
    [login]: (draft, {payload: {session}}) => {
      return draft.withMutations(state => {
        state.set('session', session)
      })
    },
    [signUp]: () => {},
  },
  defaultState,
)

export default authentication
