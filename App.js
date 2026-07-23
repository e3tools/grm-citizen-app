import {Provider as PaperProvider} from 'react-native-paper'
import {Provider as ReduxProvider} from 'react-redux'
import {
  configureLearningMaterialsApi,
  configureLearningMaterialsTranslations,
} from '@e3tools/e3-mobile-learning-materials'
import Router from './src/router'
import store from './src/store'
import {client} from './src/utils/request'
import {i18n} from './src/translations/i18n'

if (__DEV__) {
  // eslint-disable-next-line no-console
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

configureLearningMaterialsApi({
  baseURL: process.env.EXPO_PUBLIC_API_AUTH_BASE_URL,
  getAuthHeaders: async () => {
    const token = client.defaults.headers.common['Authorization']
    return token ? {Authorization: token} : {}
  },
})

configureLearningMaterialsTranslations({
  mins: i18n.t('mins'),
})

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <Router />
      </PaperProvider>
    </ReduxProvider>
  )
}

export default App
