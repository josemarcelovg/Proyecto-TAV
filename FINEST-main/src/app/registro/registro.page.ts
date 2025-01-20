import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  user: any = {
    nombre: '',
    email: '',
    password: '',
    f_nacimiento: '',
    genero: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  registrar() {
   
    if (!this.validarCampos()) {
    this.presentToast('Por favor, complete todos los campos antes de registrar.');
      return;
    }

   
    this.validarCorreo().then((existe) => {
      if (existe) {
        this.presentToast('El correo electrónico ya está registrado.');
      } else {
        
        this.usuarioService.RegistrarUsuario(this.user).subscribe(
          (res) => {
            console.log('Registro exitoso:', res);

            
            localStorage.setItem('nombre', this.user.nombre);
            localStorage.setItem('email', this.user.email);
            localStorage.setItem('password', this.user.password);

           
            this.limpiarCampos();

           
            this.router.navigate(['/login']);
          },
          (err) => {
            console.error('Error al registrar el usuario:', err);
            
          }
        );
      }
    });
  }

  validarCorreo(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const email = this.user.email.trim();
  
      this.usuarioService.verificarCorreo(email).subscribe(
        (existe) => resolve(existe),
        (error) => {
          console.error('Error al validar el correo:', error);
          this.presentToast('El correo ya existe');
          reject(error);
        }
      );
    });
  }
  
  limpiarCampos() {
    this.user = {
      nombre: '',
      email: '',
      password: '',
      f_nacimiento: '',
      genero: '',
    };
  }

  validarCampos(): boolean {
    return (
      this.user.nombre.trim() !== '' &&
      this.user.email.trim() !== '' &&
      this.user.password.trim() !== '' &&
      this.user.f_nacimiento.trim() !== '' &&
      this.user.genero.trim() !== ''
    );
  }

  async presentToast(message:string, duration?:number){
    const toast = await this.toastController.create(
      {
        message:message,
        duration:duration?duration:2000
      }
    );
    toast.present();
  }
}
