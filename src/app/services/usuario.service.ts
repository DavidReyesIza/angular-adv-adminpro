import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/Register-form.interface';
import {catchError, map, tap} from 'rxjs/operators'
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

// Esto se puede declarar dentro de la clase pero habria que usar el .this y queda a discrecion donde declararlo
const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario: Usuario

  constructor(private http: HttpClient, private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
   }

get token(){
  return localStorage.getItem('token') || '';
}

get uid():string{
  return this.usuario._id || '';
}
  googleInit(){
    gapi.load('auth2', ()=>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '401975033410-t459nb7tt93flef8r2kdg2nekepkshds.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
    });
  }

  logout(){
    localStorage.removeItem('token');
    
    
    this.auth2.signOut().then( ()=> {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean>{
    

    return this.http.get(`${base_url}/login/renew`,{

      headers:{
        'x-token':this.token
      }
      
    }).pipe(
      map((resp: any) =>{


        const {email,google,nombre,role,img='',uid} = resp.usuario;
        this.usuario = new Usuario(nombre,email,'',img,google,role,uid);
        console.log(this.usuario)
        

        localStorage.setItem('token',resp.token);

        return true;
      }),
      
      catchError(error => of(false)) // el of retornara un nuevo observable y sirve para no romper el cliclo
    ) // este catch error esta creando un nuevo observable que esta retornando un false para que devuelva a la pagina de login al usuario en cualquier error
  }


  crearUsuario(formData: RegisterForm){

   return this.http.post(`${base_url}/usuarios`,formData)
   .pipe(
    tap((resp : any)=>{
      localStorage.setItem('token',resp.token)
    })
  )

  }

  actualizarPerfil(data:{email:string, nombre: string, role:string}){
    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,{headers:{'x-token':this.token}})

  }

  login(formData: loginForm){

    return this.http.post(`${base_url}/login`,formData)
                     .pipe(
                       tap((resp : any)=>{
                         localStorage.setItem('token',resp.token)
                       })
                     )
 
   }

   loginGoogle(token){

    return this.http.post(`${base_url}/login/google`,{token}) // Como el token viene como un objeto se manda entre llaves
                     .pipe(
                       tap((resp : any)=>{
                         localStorage.setItem('token',resp.token)
                       })
                     )
 
   }
 


}
