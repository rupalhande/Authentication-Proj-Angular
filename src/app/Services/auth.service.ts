import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReq, LoginResData } from '../Models/Login';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../Models/Response';
import { RegisterUserData } from '../Models/Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn:boolean=false;

  serverUrl:string="http://localhost:5000";

  constructor(private http:HttpClient) { }

  Login(crediential:LoginReq){
      return this.http.post<ApiResponse<LoginResData>>(this.serverUrl+'/api/auth/login',crediential).pipe(
        map((res)=>{
            if(res.isSuccessed==true){
              localStorage.setItem('accestoken',res.data.accessToken);
              localStorage.setItem('refreshtoken',res.data.refreshToken);
              this.isUserLoggedIn=true;
            }
            return res;
        })
      )
  }

  RegisterUser(userData:RegisterUserData){
    return this.http.post<ApiResponse<null>>(this.serverUrl+'/api/auth/register',userData);
  }

  LogOut(){
    return this.http.get<ApiResponse<null>>(this.serverUrl+'/api/auth/revoke').pipe(
      map((res)=>{
        if(res.isSuccessed){
          localStorage.setItem('accestoken','');
          localStorage.setItem('refreshtoken','');
          this.isUserLoggedIn=false;
        }
        return res;
      })
    );

  }

  refreshUser() {
    var accessToken = localStorage.getItem('accestoken');
    var refreshToken = localStorage.getItem('refreshtoken');

    return this.http.post<ApiResponse<LoginResData>>(this.serverUrl + '/api/auth/refresh', {
      accessToken,
      refreshToken
    }).pipe(
      map((res) => {
        if (res.isSuccessed == true) {
          localStorage.setItem('accestoken', res.data.accessToken);
          localStorage.setItem('refreshtoken', res.data.refreshToken);
          this.isUserLoggedIn = true;
        }
        else{
          localStorage.setItem('accestoken','');
          localStorage.setItem('refreshtoken','');
          this.isUserLoggedIn = false;
        }
        return res;
      }),
      catchError(()=>{
        localStorage.setItem('accestoken','');
        localStorage.setItem('refreshtoken','');
        this.isUserLoggedIn = false;
        return of()
      })
    )

  }
}
