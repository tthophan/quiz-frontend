import { IOption } from "."

export interface IQuestion {
    id: number
    code: string
    text: string
    hint: string
    options: Array<IOption>
}