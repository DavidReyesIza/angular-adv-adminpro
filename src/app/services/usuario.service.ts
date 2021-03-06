import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/Register-form.interface';
import {catchError, map, tap} from 'rxjs/operators'
import { Observable, of, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2';


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

get role(): 'ADMIN_ROLE '| 'USER_ROLE'{

  return this.usuario.role;
}

guardarLocalStorage(token: string, menu: any){
  localStorage.setItem('token',token);
  localStorage.setItem('menu',JSON.stringify(menu)) // Hay que hacer el parseo a json por que el localStore solo guarda strings
}

get uid():string{
  return this.usuario.uid || '';
}

get  headers(){

  return{
    headers:{
      'x-token':this.token
    }
    
  }
  
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
    localStorage.removeItem('menu');
    
    
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
        

          this.guardarLocalStorage(resp.token,resp.menu)

        return true;
      }),
      
      catchError(error => of(false)) // el of retornara un nuevo observable y sirve para no romper el cliclo
    ) // este catch error esta creando un nuevo observable que esta retornando un false para que devuelva a la pagina de login al usuario en cualquier error
  }


  crearUsuario(formData: RegisterForm){

   return this.http.post(`${base_url}/usuarios`,formData)
   .pipe(
    tap((resp : any)=>{
      this.guardarLocalStorage(resp.token,resp.menu)
      Swal.fire('Usuario Creado', resp.email,'success')
    })
  )

  }

  actualizarPerfil(data:{email:string, nombre: string, role:string}){
    data = {
      ...data,
      role: this.usuario.role // Aca estamos extraendo el rol para que el usuario no pueda cambiarse a si mismo el rol
    };
    
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers)

  }

  login(formData: loginForm){

    return this.http.post(`${base_url}/login`,formData)
                     .pipe(
                       tap((resp : any)=>{
                        this.guardarLocalStorage(resp.token,resp.menu)
                       })
                     )
 
   }

   loginGoogle(token){

    return this.http.post(`${base_url}/login/google`,{token}) // Como el token viene como un objeto se manda entre llaves
                     .pipe(
                       tap((resp : any)=>{
                        this.guardarLocalStorage(resp.token,resp.menu)
                       })
                     )
 
   }

cargarUsuarios(desde: number = 0){// Se establece uno predeterminado por si no se envia ninguno

  const url = `${base_url}/usuarios?desde=${desde}`;
  return this.http.get<{totalRegistros: number, usuarios:Usuario[]}>(url,this.headers) // El <> despues del get es para que typescript sepa que datos retorna del backend y no se queje
  .pipe(
    map(resp =>{
      const usuarios = resp.usuarios.map(
        user => new Usuario(user.nombre,user.email,'',user.img,user.role,user.google,user.uid)
      );

      return {
        totalRegistros: resp.totalRegistros,
        usuarios
      }
    })
  )
}

eliminarUsuario(usuario: Usuario){
 const url = `${base_url}/usuarios/${usuario.uid}`;
 return this.http.delete(url,this.headers);
}


ActualizarUsuarioEnPanel(usuario: Usuario){
  return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
}

}
