import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit,OnDestroy {

  private imgSubs: Subscription;
  public cargando: boolean = true;
  public medicos: Medico[]=[];

  constructor(private medicosService: MedicoService, private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService) { }
    
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.notificarNuevaImagen
    .pipe(delay(100))
    .subscribe(img=> {
    
     this.cargarMedicos()
     
     });

    
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicosService.cargarMedicos()
    .subscribe(medicos =>{
      this.cargando = false;
      this.medicos = medicos;
      console.log(medicos)
    });

  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.cargarMedicos();
    }
  
    this.busquedaService.buscar('medicos',termino)
    .subscribe((resultados : Medico[]) =>{
      this.medicos = resultados;
    })
  }
  abrirModal(medico: Medico){
    console.log(medico);
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img);
  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
      this.medicosService.borrarMedico(medico._id)
      .subscribe(resp=>{
        Swal.fire('Medico Borrado', `${medico.nombre} fue eliminado correctamente`,'success');
        this.cargarMedicos();
      })
      }
    })
  }

}
