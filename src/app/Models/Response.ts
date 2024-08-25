export interface ApiResponse<T>{
    isSuccessed:boolean,
    message:string,
    data:T
}