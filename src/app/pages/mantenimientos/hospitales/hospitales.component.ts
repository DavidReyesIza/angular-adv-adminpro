import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;
  public hospitalesTemp: Hospital[] = [];

  constructor(private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.notificarNuevaImagen
    .pipe(delay(100))
    .subscribe(img=> {
    
     this.cargarHospitales()
     
     });

  }

  cargarHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
    .subscribe(hospitales=>{
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = this.hospitales;
    })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre)
    .subscribe(resp=>{
      Swal.fire('Guardado',hospital.nombre,'success');
    })
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital(hospital._id)
    .subscribe(resp=>{
      this.cargarHospitales();
      Swal.fire('Borrado',hospital.nombre,'success');
    })
  }

async abrirSweetAlert(){
  const {value = ''} = await Swal.fire<string>({
    title: 'Crear hospital',
    text: 'Ingrese el nombre del nuevo hospital',
    input: 'text',
    inputPlaceholder: 'Nombre del Hospital',
    showCancelButton: true,

  })

  if(value.trim().length > 0){
    this.hospitalService.crearHospital(value)
    .subscribe((resp:any) =>{
      this.hospitales.push(resp.hospital)
    })

  }
}

abrirModal(hospital: Hospital){
  console.log(hospital);
  this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
  
}

buscar(termino: string){

  if(termino.length === 0){
    return this.hospitales = this.hospitalesTemp;
  }

  this.busquedaService.buscar('hospitales',termino)
  .subscribe((resultados : Hospital[]) =>{
    this.hospitales = resultados;
  })
}

}
