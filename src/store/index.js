import {compose, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import Reactotron from '../../ReactotronConfig'
import reducers from './ducks'
let enhancerCompose = compose

if (__DEV__) {
  enhancerCompose = composeWithDevTools
}
const middleWare = enhancerCompose(Reactotron.createEnhancer())

const store = createStore(reducers, middleWare)

export default store
