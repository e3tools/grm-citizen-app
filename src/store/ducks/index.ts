import { combineReducers } from "redux-immutable";
import authentication from "./authentication.duck";

const reducers = combineReducers({ authentication });

export default reducers;
