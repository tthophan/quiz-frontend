
import storage from '../storage'
const ACCESS_TOKEN_KEY = 'accessToken'

export const persistAccessToken = async (token: string): Promise<void> => {
    storage.setItem(ACCESS_TOKEN_KEY, token)
}

export const readAccessToken = async (): Promise<string> => {
    return (await storage.getItem(ACCESS_TOKEN_KEY)) || ''

}

export const deleteToken = async (): Promise<void> => {
    storage.removeItem(ACCESS_TOKEN_KEY)
}
