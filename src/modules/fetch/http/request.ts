import axios from 'axios'
import handleFetchResponse from './response'
import { FetchRequestError, FetchRequestOptions, HttpStatusCode } from './type'

const buildFetchRequest = <T>({
    request,
    refreshToken,
    handleError,
    responseOptions
}: FetchRequestOptions<T>) => {
    return request()
        .catch((error: FetchRequestError) => {
            // Handle refresh token first
            if (
                error.response &&
                error.response.status === HttpStatusCode.Unauthorized &&
                refreshToken
            ) {
                return refreshToken().then(() => request())
            }
            if (axios.isCancel(error)) {
                return Promise.reject(error)
            }
            return error
        })
        .then((res: any) => handleFetchResponse({ ...res, ...responseOptions }))
        .catch((error: any) => {
            handleError(error)
            throw error
        })
}

export default buildFetchRequest
