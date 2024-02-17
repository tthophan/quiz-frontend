import { IQuestion } from "./questions.interface"

export interface IQuiz {
    id: number
    code: string
    title: string
    shortDescription: string
    description: string
    questions?: Array<IQuestion>
    totalQuestions: number
    isAnswered: boolean
}