import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  userNombre: string = ''; // Aquí se guarda el nombre del usuario
  userId: string = ''; // Aquí se guarda el ID del usuario

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    const savedNombre = localStorage.getItem('nombre');
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const savedId = localStorage.getItem('id');

    if (savedNombre) {
      this.userNombre = savedNombre;
    }

    if (savedId) {
      this.userId = savedId;
    }

    if (savedEmail && savedPassword) {
      this.credentials.email = savedEmail;
      this.credentials.password = savedPassword;
    }
  }

  async login() {
    if (!this.validarCredentials()) {
      return;
    }
  
    try {
      const usuario = await this.usuarioService.verificarCredenciales(this.credentials.email, this.credentials.password).toPromise();
  
      if (usuario) {
        console.log('Inicio de sesión exitoso');
  
        // Guardar datos en localStorage
        localStorage.setItem('email', usuario.email);
        localStorage.setItem('password', usuario.password);
        localStorage.setItem('nombre', usuario.nombre);
        localStorage.setItem('id', usuario.id);
  
        this.presentToast('Inicio de sesión exitoso. Redirigiendo...');
        this.router.navigate(['/home']);
      } else {
        this.presentToast('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      this.presentToast('Hubo un error al intentar iniciar sesión.');
    }
  }
  
  
  validarCredentials(): boolean {
    if (
      this.credentials.email.trim() === '' ||
      this.credentials.password.trim() === ''
    ) {
      this.presentToast('Por favor, ingrese su correo electrónico y contraseña.');
      return false;
    }
    return true;
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }

  registro() {
    this.router.navigate(['/registro']);
  }
}
