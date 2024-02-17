import { configureStore } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import { errorLoggingMiddleware } from './middlewares/errorLogging.middleware'
import reducer from './slices'

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      errorLoggingMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
