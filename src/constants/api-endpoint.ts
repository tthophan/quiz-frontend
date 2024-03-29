export const API_ENDPOINTS = {
    BASE_URL:'https://quiz-backend-bmra.onrender.com',// process.env.NEXT_PUBLIC_API_BACKEND_URL,
    QUIZZES: {
        LIST: '/api/v1/quizzes',
        SUBMIT_QUIZ: '/api/v1/quizzes',
        CHECK_QUIZ_ANSWERED: '/api/v1/quizzes/answer/check',
        DETAIL: '/api/v1/quizzes/:code',
        VANI: '/api/v1/quizzes/vani-quiz/detail',
        ANSWER_QUESTION: '/api/v1/quizzes/answer-question',
    },
    AUTH: {
        SIGN_UP: '/api/v1/auth/sign-up',
        SIGN_IN: '/api/v1/auth/sign-in',
    }
}
