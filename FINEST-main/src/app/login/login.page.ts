import { Component } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user: any = {
    nombre: '',
    email: '',
    password: '',
    f_nacimiento: '',
    genero: '',
  };

  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    public toastController: ToastController
  ) {}

  validarCorreo() {
    const email = this.credentials.email.trim();

    if (email === '') {
      this.presentToast('Error, porfavor ingrese un correo');
      return;
    }

    this.usuarioService.verificarCorreo(email).subscribe(
      (existe) => {
        if (existe) {
          this.presentToast('Éxito');
        } else {
          this.presentToast('Error');
        }
      },
      (error) => {
        console.error('Error al validar el correo:', error);
      }
    );
  }

  ngOnInit() {
   
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail && savedPassword) {
      this.credentials.email = savedEmail;
      this.credentials.password = savedPassword;
    }
  }

  login() {
    if (!this.validarCredentials()) {
      return;
    }

    console.log('Correo ingresado:', this.credentials.email);
    console.log('Contraseña ingresada:', this.credentials.password);

    this.usuarioService.LoginUsuario(this.credentials).subscribe(
      (response) => {
        if (response.success) {
          console.log('Inicio de sesión exitoso:', response.user);

          localStorage.setItem('email', this.credentials.email);
          localStorage.setItem('password', this.credentials.password);

          this.presentToast("Redireccionando");
          this.router.navigate(['/home']);
        } else {
          console.log('Error:', response.message);
        }
      },
      (error) => {
        console.error('Error inesperado:', error);
        this.presentToast("error");
      }
    );
  }

  validarCredentials(): boolean {
    if (
      this.credentials.email.trim() === '' ||
      this.credentials.password.trim() === ''
    ) {
      this.presentToast(
        'Por favor, ingrese su correo electrónico y contraseña para continuar.'
      );
      return false;
    }
    return true;
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

