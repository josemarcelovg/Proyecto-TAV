import { Component } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
  userNombre: string = '';  // Aquí se guarda el nombre del usuario

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    public toastController: ToastController,
    private authService: AuthService  
  ) {}

  
  validarCorreo() {
    const email = this.credentials.email.trim();

    if (email === '') {
      this.presentToast('Error, por favor ingrese un correo');
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
    const savedNombre = localStorage.getItem('nombre');

  if (savedNombre) {
    this.userNombre = savedNombre;  
  }
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail && savedPassword) {
      this.credentials.email = savedEmail;
      this.credentials.password = savedPassword;
    }
  }

 
  async login() {
    if (!this.validarCredentials()) {
      return;
    }
  
    
    const isAuthenticated = await this.authService.authenticateUser(this.user.email, this.user.password);
    
    if (isAuthenticated) {
      console.log('Inicio de sesión exitoso');
      
     
      localStorage.setItem('email', this.user.email);
      localStorage.setItem('password', this.user.password);
      localStorage.setItem('nombre', this.user.nombre);
  
     
      this.presentToast("Redireccionando...");
  
      
      this.router.navigate(['/home']);
    } else {
      console.log('Datos incorrectos');
      this.presentToast('Datos incorrectos'); 
    }
  }
  
  validarCredentials(): boolean {
    if (
      this.user.email.trim() === '' ||
      this.user.password.trim() === ''
    ) {
      this.presentToast('Por favor, ingrese su correo electrónico y contraseña para continuar.');
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

  registro(){
    this.router.navigate(['/registro']);
  }
}