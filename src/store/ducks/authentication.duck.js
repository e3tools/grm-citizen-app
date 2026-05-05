import {Map} from 'immutable'
import {createActions, handleActions} from 'redux-actions'
import {client} from '../../utils/request'
import {
  getEncryptedData,
  removeEncryptedValue,
  storeEncryptedData,
} from '../../utils/storageManager'

const defaultState = Map({
  session: null,
  profile: null,
})

function storeSessionData(sessionObject) {
  storeEncryptedData(
    process.env.EXPO_PUBLIC_USER_SESSION_KEY,
    JSON.stringify(sessionObject),
  )
}

export async function getSessionData() {
  const sessionData = await getEncryptedData(
    process.env.EXPO_PUBLIC_USER_SESSION_KEY,
  )
  return sessionData ? JSON.parse(sessionData) : null
}

export async function removeSessionData() {
  await removeEncryptedValue(process.env.EXPO_PUBLIC_USER_SESSION_KEY)
  removeTokenFromHttpClient()
}

export function addTokenToHttpClient(sessionObject) {
  client.defaults.headers.common['Authorization'] =
    `Token ${sessionObject.token}`
}

export function removeTokenFromHttpClient() {
  client.defaults.headers.common['Authorization'] = undefined
}

export const {signUp, login, logout, storeProfile} = createActions({
  LOGIN: session => {
    addTokenToHttpClient(session)
    storeSessionData(session)
    return {
      session,
    }
  },

  LOGOUT: () => {
    removeSessionData()
    return
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
    [logout]: draft => {
      return draft.withMutations(state => {
        state.set('session', null)
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
