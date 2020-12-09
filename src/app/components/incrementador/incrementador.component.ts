import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent  {
  
 @Input('valor') progreso: number = 50;
 @Input() btnClass: string = 'btn btn-primary';

 @Output()  ValorSalida: EventEmitter<number> = new EventEmitter();

  cambiarValor(valor: number){
    if(this.progreso >= 100 && valor >=0){
      this.ValorSalida.emit(100);
       this.progreso =100;
       return

    }if(this.progreso <= 0 && valor<0){
      this.ValorSalida.emit(0);
      this.progreso =0;
      return

   }

    this.progreso = this.progreso + valor;
    this.ValorSalida.emit(this.progreso);
    

  }

  onChange(nuevoValor: number){
    
    if(nuevoValor >= 100){
      this.progreso = 100;
    }else if (nuevoValor <= 0){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }

    this.ValorSalida.emit(this.progreso)
  // this.ValorSalida.emit(valor);
  }

}
