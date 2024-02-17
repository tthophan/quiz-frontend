import { API_ENDPOINTS } from '@/constants'
import { ISignUpRequest } from '@/interfaces'
import { Post } from '@/modules/fetch'
import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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

export const requestSignUp = createAsyncThunk(
    'auth/requestSignUp',
    async (payload: ISignUpRequest, { dispatch }) =>
        Post(API_ENDPOINTS.AUTH.SIGN_UP, payload)
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
