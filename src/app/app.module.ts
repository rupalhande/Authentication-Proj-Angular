import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { appInitializer } from './helper/app.initializer';
import { AuthService } from './Services/auth.service';
import { AuthIntercetorInterceptor } from './Interceptors/auth-intercetor.interceptor';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accestoken'),
        allowedDomains: ["example.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      }
    }
    )
  ],
  providers: [
    {provide:APP_INITIALIZER,useFactory:appInitializer,multi:true,deps:[AuthService]},
    {provide:HTTP_INTERCEPTORS,useClass:AuthIntercetorInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
