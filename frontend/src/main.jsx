/* eslint @stylistic/indent: 0 */
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'
import './i18n'
import { Provider, ErrorBoundary } from '@rollbar/react'
import { rollbarConfig } from './utils/rollbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider config={rollbarConfig}>
      <ErrorBoundary fallbackUI={<div>Something went wrong</div>}>
        <>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)
