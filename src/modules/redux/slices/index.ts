import { persistReducer } from 'redux-persist'

import storage from '../storage'
import appReducer from './app.slice'
import authReducer from './auth.slice'

const globalReducer = {
    app: persistReducer(
        {
            key: 'app',
            storage
        },
        appReducer
    ),
    auth: persistReducer(
        {
            key: 'auth',
            storage
        },
        authReducer
    )
}

export default globalReducer
