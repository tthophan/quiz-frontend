import { API_ENDPOINTS } from '@/constants'
import { IAnswerQuestion, IQuestion, IQuiz, IQuizAnswer } from '@/interfaces'
import { Get, Post } from '@/modules/fetch'
import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AppState {
    isSidebarOpen: boolean
    quizzes: Array<IQuiz>
    quiz?: IQuiz
    vaniQuiz?: IQuiz
    quizResult?: IQuiz
    currentQuestion?: IQuestion
}

export interface QuizList {
    items: Array<IQuiz>
}

const initialState: AppState = {
    isSidebarOpen: true,
    quizzes: [],
    quiz: undefined,
    quizResult: undefined,
    currentQuestion: undefined
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

export const setCurrentQuestion = createAction<PrepareAction<IQuestion>>(
    'app/setCurrentQuestion',
    (state: IQuestion) => {
        return {
            payload: state
        }
    }
)

export const doStartQuiz = createAsyncThunk(
    'auth/signOut',
    async (_: void, { dispatch }) => {
        dispatch(setQuizList(null))
        dispatch(setQuiz(null))
        dispatch(setVaniQuiz(null))
        dispatch(setQuizResult(null))
        dispatch(setCurrentQuestion(null))
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

export const setVaniQuiz = createAction<PrepareAction<IQuiz>>(
    'app/setVaniQuiz',
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

export const checkVaniQuizAnswered: any = createAsyncThunk(
    'app/checkVaniQuizAnswered',
    async (_, { dispatch }) => await Get(API_ENDPOINTS.QUIZZES.CHECK_QUIZ_ANSWERED, { skipHandleError: false })
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

export const fetchVaniQuiz = createAsyncThunk(
    'app/fetchVaniQuiz',
    async (_, { dispatch }) => {
        return Get(API_ENDPOINTS.QUIZZES.VANI, { skipHandleError: false }).then(
            (res: any) => {
                dispatch(setVaniQuiz(res))
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
            state.quizzes = action.payload?.items
        })
        builder.addCase(setQuiz, (state, action) => {
            state.quiz = action.payload
        })
        builder.addCase(setVaniQuiz, (state, action) => {
            state.vaniQuiz = action.payload
        })
        builder.addCase(setQuizResult, (state, action) => {
            state.quizResult = action.payload
        })
        builder.addCase(setCurrentQuestion, (state, action) => {
            state.currentQuestion = action.payload
        })
    }
})

export default appSlice.reducer
