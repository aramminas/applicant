import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider as ProviderRedux} from 'react-redux'
import {ToastProvider} from 'react-toast-notifications'
import store from './store'

import App from './App'
import * as serviceWorker from './serviceWorker'

import './index.css'
import './scss/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

const rootElement = document.getElementById('root')

ReactDOM.render(
    <ProviderRedux store={store}>
        <BrowserRouter>
            <ToastProvider>
                <React.StrictMode>
                    <App/>
                </React.StrictMode>
            </ToastProvider>
        </BrowserRouter>
    </ProviderRedux>,
    rootElement
)

serviceWorker.unregister()
