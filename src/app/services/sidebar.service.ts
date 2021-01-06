import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

public menu = [];

cargarMenu(){
  this.menu = JSON.parse(localStorage.getItem('menu')) || [];
}


/*   menu: any[] = [    //Esto ahora viene del backend
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Main', url:'/'},
        {titulo: 'ProgressBar', url:'progress'},
        {titulo: 'Graficas', url:'grafica1'},
        {titulo: 'Promesas',url:'promesas'},
        {titulo: 'RxJs',url:'rxjs'}
      ]

    },

    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        {titulo: 'Usuarios', url:'usuarios'},
        {titulo: 'Hospitales', url:'hospitales'},
        {titulo: 'Medicos', url:'medicos'},

      ]

    }
  ]; */

  constructor() { }
}
