import { HandleFetchResponseOptions, HttpStatusCode } from './type'

const HttpSuccessCodes = [200, 201, 202]

const handleFetchResponse = <T>({
    status,
    data,
    standardizeResponse,
    forbiddenErrorMessage,
    fetchErrorMessage,
    serverErrorMessage,
    ...args
}: HandleFetchResponseOptions<T>) => {
    if (status === HttpStatusCode.Forbidden) {
        return Promise.reject(
            new Error(
                forbiddenErrorMessage ?? "You don't have permission on this action!"
            )
        )
    }
    const serverResponseMessage = (args as any)?.response?.data?.message
    if (!HttpSuccessCodes.includes(status)) {
        return Promise.reject(
            new Error(serverResponseMessage ?? fetchErrorMessage ?? 'Something went wrong!')
        )
    }

    if (!data) {
        return Promise.reject(
            new Error(
                serverResponseMessage ?? serverErrorMessage ?? 'Please check your network and try again.'
            )
        )
    }

    const validResponse = standardizeResponse(data)

    if (validResponse.message) {
        return Promise.reject(new Error(validResponse.message))
    }

    return Promise.resolve(validResponse?.data ?? data)
}

export default handleFetchResponse
