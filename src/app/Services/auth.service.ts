import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReq, LoginResData } from '../Models/Login';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../Models/Response';
import { RegisterUserData } from '../Models/Auth';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn:BehaviorSubject<boolean>= new BehaviorSubject(false);

  serverUrl:string="http://localhost:5000";

  constructor(private http:HttpClient,private jwtHelper:JwtHelperService) { }

  UserLoggedIn(){
    return this.isUserLoggedIn.value && !this.jwtHelper.isTokenExpired(this.getAccessToken());
  }

  Login(crediential:LoginReq){
      return this.http.post<ApiResponse<LoginResData>>(this.serverUrl+'/api/auth/login',crediential).pipe(
        map((res)=>{
            if(res.isSuccessed==true){
              localStorage.setItem('accestoken',res.data.accessToken);
              localStorage.setItem('refreshtoken',res.data.refreshToken);
              this.isUserLoggedIn.next(true);
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
          this.isUserLoggedIn.next(false);
          
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
          this.isUserLoggedIn.next(true);
        }
        else{
          localStorage.setItem('accestoken','');
          localStorage.setItem('refreshtoken','');
          this.isUserLoggedIn.next(false);
        }
        return true;
      }),
      catchError(()=>{
        localStorage.setItem('accestoken','');
        localStorage.setItem('refreshtoken','');
        this.isUserLoggedIn.next(false);
        return of(false);
      })
    )

  }

  getAccessToken(){
    return localStorage.getItem('accestoken')
  }

  getRefreshToken(){
    return localStorage.getItem('refreshtoken')
  }
}
