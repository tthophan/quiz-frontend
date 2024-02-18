import { API_ENDPOINTS } from '@/constants'
import { notificationController } from '@/controllers/notification.controller'
import { readAccessToken } from '@/modules/redux/storages/auth.storage'
import { AxiosInstance, AxiosResponse } from 'axios'
import buildFetchInstance from './instance'
import buildFetchRequest from './request'

type FetchOptions = {
    skipHandleError?: boolean
}

const fetchRequest = async (
    buildRequest: (_instance: AxiosInstance) => Promise<AxiosResponse<any, any>>,
    options?: FetchOptions
) => {
    const fetchInstance = await buildFetchInstance({
        baseURL: API_ENDPOINTS.BASE_URL,
        getAccessToken: readAccessToken,
        customizeAuthorizeHeader: (accessToken: string) => `Bearer ${accessToken}`
    })

    return buildFetchRequest<AxiosResponse<any, any>>({
        request: () => buildRequest(fetchInstance),
        handleError: e => {
            if (options?.skipHandleError) {
                console.error('fetch error', e)
                throw e
            }
            notificationController.error({
                message: e?.message ?? ('validation.500')
            })
        },
        responseOptions: {
            standardizeResponse: data => {
                return {
                    data: data.data,
                    message: data?.data?.message
                }
            },
            forbiddenErrorMessage: 'Access Denied',
            // fetchErrorMessage: ('validation.500'),
            serverErrorMessage: ('validation.500')
        }
    })
}

export const Get = async (
    url: string,
    options?: FetchOptions
): Promise<AxiosResponse<object>> =>
    fetchRequest(instance => instance.get(url), options)

export const Post = async <T = Object>(
    url: string,
    payload?: object,
    options?: FetchOptions
): Promise<AxiosResponse<T>> =>
    fetchRequest(instance => instance.post(url, payload), options)

export const Put = async (
    url: string,
    payload?: object,
    options?: FetchOptions
): Promise<AxiosResponse<object>> =>
    fetchRequest(instance => instance.put(url, payload), options)

export const Delete = (
    url: string,
    options: FetchOptions
): Promise<AxiosResponse<object>> =>
    fetchRequest(instance => instance.delete(url), options)
