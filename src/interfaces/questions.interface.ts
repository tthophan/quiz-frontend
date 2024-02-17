import { IOption } from "."

export interface IQuestion {
    id: number
    code: string
    text: string
    hint: string
    maxOptionCanSelected: number
    options: Array<IOption>
}