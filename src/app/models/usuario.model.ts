import { environment } from "src/environments/environment"

const base_url= environment.base_url;

export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string,
        public role?: 'ADMIN_ROLE '| 'USER_ROLE',
        public google?: boolean,
        public uid?: string
    ) { }


    get imagenUrl(){
        // /upload/usuario/no-image
        if(!this.img){
            return `${base_url}/upload/usuarios/no-image`
        }else if(this.img.includes('http')){
            
            return this.img;

        } else  if(this.img){
            return `${base_url}/upload/usuarios/${this.img}`
        }else{
            return `${base_url}/upload/usuarios/no-image`
        }
       
    }
}