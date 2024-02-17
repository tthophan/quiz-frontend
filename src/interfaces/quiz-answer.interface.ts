
export interface IOptionResult {
    questionId: number

    optionIds: Array<number>
}

export interface IQuizAnswer {
    id: number
    optionResults: Array<IOptionResult>
}
