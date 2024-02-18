export interface IAuthResponse {
    data: {
        jwt: string
        userInfo: any
    }
}