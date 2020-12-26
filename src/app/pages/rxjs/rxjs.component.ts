import { Component, OnInit } from '@angular/core';
import { Observable,interval } from 'rxjs';
import {retry} from 'rxjs/operators'

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent  {




  constructor() { 

    

    this.retornaObservable().pipe(
      retry(1)
    ).subscribe(
    valor=> console.log('Subs',valor),
    (error)=> console.warn('Error',error),
    () => console.info('obs terminado')
    );
  }

  retornaObservable(){
    let i = -1;

    const obs$ = new Observable<number>(observer =>{
      

     const internalo = setInterval(()=>{
      
        i++;
        observer.next(i);

        if(i ===4 ){
          clearInterval(internalo);
          observer.complete();

        }
        if(i ==2){
          i = 0;
          observer.error('I llego al valor de 2');
        }
      },1000)
    } );

    return obs$;
  }


}
