import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService,
    private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean{
      console.log('admin guard')
   
      if(this.usuarioService.role === 'ADMIN_ROLE '){
        return  true;
      }else{
        this.router.navigateByUrl('/dashboard')
        return false
      }
   
   //   return (this.usuarioService.role === 'ADMIN_ROLE ') ? true : false;
    
/*       if(this.usuarioService.role ==='ADMIN_ROLE '){ // lo de arriba es lo mismo que aqui solo que con ternarios
        return true;

      }else{
        return false
      } */

  }
  
}
