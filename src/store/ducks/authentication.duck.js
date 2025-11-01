import { Map } from "immutable";
import { createActions, handleActions } from "redux-actions";
import {
  storeEncryptedData,
} from "../../utils/storageManager";
import { client } from "../../utils/request";
import config from "../../../config";

const defaultState = Map({
  session: null,
  profile: null,
});

function storeSessionData(sessionObject) {
  storeEncryptedData(config.USER_SESSION_KEY, JSON.stringify(sessionObject));
}

export async function getSessionData() {
  const sessionData = await getEncryptedData(config.USER_SESSION_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
}


function addTokenToHttpClient(sessionObject) {
  client.defaults.headers.common["Authorization"] = `Token ${sessionObject.token}`;
  console.log(client.defaults.headers.common["Authorization"])
}
export const { signUp, login } = createActions({
  LOGIN: (session) => {

    addTokenToHttpClient(session)

    storeSessionData(session);

    return {
      session
    };
  },
  SIGN_UP: (session, userCredentials) => {
    addTokenToHttpClient(session)
    storeSessionData(session);
    return { session, password: userCredentials.password, username: userCredentials.email };
  }
});

const authentication = handleActions(
  {
    [login]: (draft, { payload: { session } }) => {
      return draft.withMutations((state) => {
        state.set("session", session);
      });
    },
    [signUp]: (draft, { payload: { session, username, password } }) => {
      return draft.withMutations((state) => {
        state.set("session", session);
      });
    }
  },
  defaultState
);

export default authentication;