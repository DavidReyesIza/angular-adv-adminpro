import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2: any;

  public loginForm = this.fb.group({
  
  
    // la instruccion || hace que si encuentra un null en la primera condicion establecera un string vacio
    email: [localStorage.getItem('email') || '',[Validators.required, Validators.email]],
    password: ['',Validators.required],
    remember: [false]

  });

  constructor(private router: Router, private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){


    this.usuarioService.login(this.loginForm.value)
    .subscribe(resp =>{
      
      if(this.loginForm.get('remember').value){ // remember es un boolean por lo tanto si es true es por que quiere recordar su correo y entra al if
        localStorage.setItem('email',this.loginForm.get('email').value);

      }else {
        localStorage.removeItem('email');
      }

      // Navegando al dashboard
     this.router.navigateByUrl('/');
    },(err)=>{
             // Si sucede un error
             Swal.fire('Error',err.error.msg, 'error');
    })

   // this.router.navigateByUrl('/');
  }

 /*  var id_token = googleUser.getAuthResponse().id_token; */



     renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
/*         'onsuccess': this.onSuccess,
        'onfailure': this.onFailure */
      });
      this.startApp();
    }

     startApp(){
      gapi.load('auth2', ()=>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '401975033410-t459nb7tt93flef8r2kdg2nekepkshds.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        this.attachSignin(document.getElementById('my-signin2'));
      });
    };


    attachSignin(element) {
     
      this.auth2.attachClickHandler(element, {},
          (googleUser)=> {
            const id_token = googleUser.getAuthResponse().id_token;
           // console.log('este es el token mijitooo '+id_token);
           this.usuarioService.loginGoogle(id_token)
           .subscribe(resp =>{
             this.ngZone.run(()=>{
                           // Navegando al dashboard
             this.router.navigateByUrl('/');
             })

           });


          }, (error) => {
            alert(JSON.stringify(error, undefined, 2));
          });
        }
}
