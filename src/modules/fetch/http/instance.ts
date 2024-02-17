import axios, { RawAxiosRequestHeaders } from 'axios'
import { BuildFetchInstanceOptions, FetchInstance } from './type'

const buildFetchInstance = async ({
    baseURL,
    getAccessToken,
    customizeAuthorizeHeader,
    ...params
}: BuildFetchInstanceOptions): Promise<FetchInstance> => {
    const headers: RawAxiosRequestHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    if (getAccessToken) {
        let token = await getAccessToken()

        if (token) {
            headers.Authorization = customizeAuthorizeHeader
                ? customizeAuthorizeHeader(token)
                : `Bearer ${token}`
        }
    }

    return axios.create({
        baseURL,
        headers,
        ...params
    })
}

export default buildFetchInstance
