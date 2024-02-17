import { PrepareAction, createAction, createSlice } from '@reduxjs/toolkit'
import { persistAccessToken } from '../storages/auth.storage'

export interface AuthState {
    accessToken?: string
}

const initialState: AuthState = {
    accessToken: undefined,
}


export const doSetAccessToken = createAction<PrepareAction<string>>(
    'auth/doSetAccessToken',
    (value: string) => {
        return {
            payload: value
        }
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(doSetAccessToken, (state, action) => {
            persistAccessToken(action.payload)
            state.accessToken = action.payload
        })
    }
})

export default authSlice.reducer
