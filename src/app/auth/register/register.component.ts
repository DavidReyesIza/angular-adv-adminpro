import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSummited = false;

  public registerForm = this.fb.group({
  
    nombre: ['David',Validators.required],
    email: ['test100@gmail.com',[Validators.required, Validators.email]],
    password: ['123',Validators.required],
    password2: ['123',Validators.required],
    terminos: [true,Validators.required]

  },{ // Aca se ponen las validaciones personalizadas
    validators: this.passwordsIguales('password','password2')
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
  }

  crearUsuario(){
    this.formSummited = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    // Realizar posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
     .subscribe(resp =>{
       // Navegando al dashboard
       this.router.navigateByUrl('/');
     }, (err) => {
       // Si sucede un error
       Swal.fire('Error',err.error.msg, 'error');
     });
  }

  campoNoValido(campo: string) : boolean{
    if(this.registerForm.get(campo).invalid && this.formSummited){
      return true;
    }else
    return false
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if((pass1 !== pass2) && this.formSummited){
      return true;
    }else{
      return false;
    }

  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSummited;
  }

  passwordsIguales(pass1Name: string, pass2Name: string){

    return (formGroup: FormGroup) =>{

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual: true});
      }

    }


  }

}
