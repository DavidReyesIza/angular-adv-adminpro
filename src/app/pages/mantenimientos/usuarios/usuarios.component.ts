import { Component, OnDestroy, OnInit } from '@angular/core';
import { clearScreenDown } from 'readline';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = []
  public usuariosTemp: Usuario[] = []
  public desde: number= 0;
  public cargando: boolean = true;
  public imgSubs : Subscription;

  constructor(private usuarioService: UsuarioService,
    private BusquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }
  
    ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

   this.cargarUsuarios();

  this.imgSubs = this.modalImagenService.notificarNuevaImagen
   .pipe(delay(100))
   .subscribe(img=> {
   
    this.cargarUsuarios()
    
    });
  }

  cargarUsuarios(){

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({totalRegistros, usuarios})=>{
      
      this.totalUsuarios = totalRegistros;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })

  }


  cambiarPagina(valor: number){

    this.desde += valor;
    if(this.desde <0 ){
      this.desde= 0;
    }else if(this.desde > this.totalUsuarios){
      this.desde -=valor;
    }
    this.cargarUsuarios();

  }

  buscar(termino: string){


    if(termino.length===0){
      return this.usuarios = this.usuariosTemp;
    }

   this.BusquedasService.buscar('usuarios',termino)
   .subscribe((resultados: Usuario[])=> {
     this.usuarios = resultados;
   });
  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.usuarioService.usuario.uid){
      return Swal.fire('Error','No puede borrarse a si mismo','error');
    }
   
  Swal.fire({
    title: 'Borrar usuario?',
    text: `Esta a punto de borrar a ${usuario.nombre}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrarlo'
  }).then((result) => {
    if (result.isConfirmed) {
    this.usuarioService.eliminarUsuario(usuario)
    .subscribe(resp=>{
      Swal.fire('Usuario Borrado', `${usuario.nombre} fue eliminado correctamente`,'success');
      this.cargarUsuarios();
    })
    }
  })
  }


  cambiarRole(usuario: Usuario){
    this.usuarioService.ActualizarUsuarioEnPanel(usuario)
    .subscribe(resp =>{
      console.log(resp);
    })
  }


  abrirModal(usuario: Usuario){
  
   this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img);

  }
}
