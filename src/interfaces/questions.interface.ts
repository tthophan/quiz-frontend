import { IOption } from "."

export interface IQuestion {
    id: number
    code: string
    text: string
    hint: string
    result: boolean
    submitted: boolean
    maxOptionCanSelected: number
    options: Array<IOption>
}