export const API_ENDPOINTS = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
    QUIZZES: {
        LIST: '/api/v1/quizzes',
        SUBMIT_QUIZ: '/api/v1/quizzes',
        DETAIL: '/api/v1/quizzes/:code',
        ANSWER_QUESTION: '/api/v1/quizzes/answer-question',
    },
}
