export interface LoginReq{
    email:string,
    password:string
}

export interface LoginResData{
    accessToken:string
    refreshToken:string
    userData:object
}
