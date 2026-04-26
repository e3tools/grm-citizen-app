import { Map } from 'immutable'
import { createActions, handleActions } from 'redux-actions'
import config from '../../../config'
import { client } from '../../utils/request'
import { getEncryptedData, storeEncryptedData } from '../../utils/storageManager'

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

export const {signUp, login, storeProfile} = createActions({
  LOGIN: session => {
    addTokenToHttpClient(session)
    storeSessionData(session)
    return {
      session,
    }
  },
  STORE_PROFILE: profile => {
    return {
      profile,
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
    [storeProfile]: (draft, {payload: {profile}}) => {
      return draft.withMutations(state => {
        state.set('profile', profile)
      })
    },
    [signUp]: () => {},
  },
  defaultState,
)

export default authentication
