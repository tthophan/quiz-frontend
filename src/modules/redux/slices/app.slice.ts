import { API_ENDPOINTS } from '@/constants'
import { IAnswerQuestion, IQuiz, IQuizAnswer } from '@/interfaces'
import { Get, Post } from '@/modules/fetch'
import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AppState {
    isSidebarOpen: boolean
    quizzes: Array<IQuiz>
    quiz?: IQuiz
    quizResult?: IQuiz
}

export interface QuizList {
    items: Array<IQuiz>
}

const initialState: AppState = {
    isSidebarOpen: true,
    quizzes: [],
    quiz: undefined,
    quizResult: undefined
}

export const doSetSidebarOpen = createAction<PrepareAction<boolean>>(
    'app/doSetSidebarOpen',
    (value: boolean) => {
        return {
            payload: value
        }
    }
)

export const setQuizList = createAction<PrepareAction<QuizList>>(
    'app/setQuizList',
    (state: QuizList) => {
        return {
            payload: state
        }
    }
)
export const setQuiz = createAction<PrepareAction<IQuiz>>(
    'app/setQuiz',
    (state: IQuiz) => {
        return {
            payload: state
        }
    }
)
export const setQuizResult = createAction<PrepareAction<IQuiz>>(
    'app/setQuizResult',
    (state: IQuiz) => {
        return {
            payload: state
        }
    }
)

export const fetchQuizzes = createAsyncThunk(
    'app/fetchQuizzes',
    async (_, { dispatch }) => Get(API_ENDPOINTS.QUIZZES.LIST, { skipHandleError: true }).then(
        (res: any) => {
            dispatch(
                setQuizList({
                    items: res.items
                })
            )
            return res
        }
    )
)

export const submitQuiz: any = createAsyncThunk(
    'app/fetchQuizzes',
    async (payload: IQuizAnswer, { dispatch }) => await Post(API_ENDPOINTS.QUIZZES.SUBMIT_QUIZ, payload, { skipHandleError: false })
)

export const answerQuestion: any = createAsyncThunk(
    'app/answerQuestion',
    async (payload: IAnswerQuestion, { dispatch }) => await Post(API_ENDPOINTS.QUIZZES.ANSWER_QUESTION, payload, { skipHandleError: false })
)

export const fetchQuiz = createAsyncThunk(
    'app/fetchQuizzes',
    async (payload: string, { dispatch }) => {
        return Get(API_ENDPOINTS.QUIZZES.DETAIL.replace(':code', payload), { skipHandleError: false }).then(
            (res: any) => {
                dispatch(setQuiz(res))
                return res
            }
        )
    }
)

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(doSetSidebarOpen, (state, action) => {
            state.isSidebarOpen = action.payload
        })
        builder.addCase(setQuizList, (state, action) => {
            state.quizzes = action.payload.items
        })
        builder.addCase(setQuiz, (state, action) => {
            state.quiz = action.payload
        })
        builder.addCase(setQuizResult, (state, action) => {
            state.quizResult = action.payload
        })
    }
})

export default appSlice.reducer
