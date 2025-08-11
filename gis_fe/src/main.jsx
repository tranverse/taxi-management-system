import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@app/App'
import { Provider } from 'react-redux'
import storeRedux from '@redux/store.redux'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')).render(
  <Provider store={storeRedux}>
    <App />
  </Provider>,
)
