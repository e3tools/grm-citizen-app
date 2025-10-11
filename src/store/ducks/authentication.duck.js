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
  userPassword: null, username: null, //TODO: Delete after migrating to the new services, used for debugging purposes with old data.
});

function storeSessionData(sessionObject) {
  storeEncryptedData(config.USER_SESSION_KEY, JSON.stringify(sessionObject));
}

function addTokenToHttpClient(sessionObject) {
  client.defaults.headers.common["Authorization"] = `Token ${sessionObject.token}`;
}
export const { signUp } = createActions({
  SIGN_UP: (session, userCredentials) => {
    addTokenToHttpClient(session)
    storeSessionData(session);
    return { session, password: userCredentials.password, username: userCredentials.email };
  }
});

const authentication = handleActions(
  {

    [signUp]: (draft, { payload: { session, username, password } }) => {
      return draft.withMutations((state) => {
        state.set("session", session);
      });
    }
  },
  defaultState
);

export default authentication;