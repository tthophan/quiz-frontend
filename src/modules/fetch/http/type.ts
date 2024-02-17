import {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios'

export { HttpStatusCode } from 'axios'

// Instance
export type FetchInstance = AxiosInstance

// Request
type BaseFetchInstanceOptions = {
    getAccessToken: () => Promise<string> | string
    customizeAuthorizeHeader?: (accessToken: string) => string
}

export type BuildFetchInstanceOptions = BaseFetchInstanceOptions &
    AxiosRequestConfig

export type FetchRequestOptions<T> = {
    request: () => Promise<T>
    refreshToken?: () => Promise<any>
    handleError: (error: FetchRequestError) => void
    responseOptions: BaseHandleFetchResponseOptions<T>
}

export type FetchOptions = {
    endpointURL: string
    config?: Omit<AxiosRequestConfig, 'baseUrl'>
}

// Response
export type FetchResponse<T> = AxiosResponse<T>

export type StandardizeResponseData = {
    data: any
    message: string
}

type BaseHandleFetchResponseOptions<T> = {
    standardizeResponse: (data: T) => StandardizeResponseData
    forbiddenErrorMessage?: string
    fetchErrorMessage?: string
    serverErrorMessage?: string
}

export type HandleFetchResponseOptions<T> = AxiosResponse<T> &
    BaseHandleFetchResponseOptions<T>

// Handle Error
export type FetchRequestError = AxiosError
