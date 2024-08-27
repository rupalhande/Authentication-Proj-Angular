import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/Models/Response';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient,private auth:AuthService,private router:Router) { }
  product!: any[];

  ngOnInit(): void {
    this.http.get<ApiResponse<any[]>>("http://localhost:5000/api/product").subscribe((res) => {
      this.product = res.data;
    }
    )
  }
  logOut(){
    this.auth.LogOut().subscribe(res=>{
      if(res.isSuccessed){
        this.router.navigateByUrl('/login')
      }
    });

  }
}
