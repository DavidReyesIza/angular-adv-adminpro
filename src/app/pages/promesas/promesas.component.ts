import { Component, OnInit } from '@angular/core';
import { promise } from 'protractor';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    /* const promesa = new Promise((resolve,reject)=>{

      if(false){

      }else{
        reject('Algo salio mal mijito')
      }

      resolve('hola mundo');


    });
  
    promesa.then((Mensae)=>{
      console.log(Mensae)
    })
    .catch(error => console.log('Error en mi promesa '+error)) */

    this.getUsuarios().then(usuario => {
      console.log(usuario);
    });

  }

  
  getUsuarios(){
    const promesa = new Promise(resolve =>{

      
          fetch('https://reqres.in/api/users?page=2')
          .then(resp => resp.json())
          .then(body => resolve(body.data));
    });

    return promesa;
  }

}
