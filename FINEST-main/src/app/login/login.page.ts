import { Component } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {


  user:any={
    nombre:'',
    email:'',
    password:'',
    f_nacimiento:'',
    genero:''
  }
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Recuperar los datos del registro desde localStorage
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail && savedPassword) {
      // Rellenar los campos automáticamente con los datos guardados
      this.credentials.email = savedEmail;
      this.credentials.password = savedPassword;
    }
  }

  login() {


    
      if (!this.validarCredentials()) {
        alert('Por favor, complete todos los campos antes de registrar.');
        return;
      }
    
      console.log('Registrando usuario...');
      // Lógica para registrar al usuario
    
    
  
    console.log('Iniciando sesión...');
    console.log(this.credentials.email);
    console.log(this.credentials.password)

    this.usuarioService.LoginUsuario(this.credentials).subscribe(
      (res) => {
        console.log('Inicio de sesión exitoso:', res);
        // Mostrar alerta con temporizador y redirigir a la página principal
        this.mostrarAlertaConTemporizador();
      },
      (err) => {
        console.error('Error al iniciar sesión:', err);
        this.mostrarAlertaError(); // Mostrar una alerta en caso de error
      }
    );
  }

  validarCredentials(): boolean {
    if (
      this.credentials.email.trim() === '' || 
      this.credentials.password.trim() === ''
    ) {
      // Mostrar un mensaje de error si falta algún dato en credentials
      alert('Por favor, ingrese su correo electrónico y contraseña para continuar.');
      return false; // Devuelve false si algún campo está vacío
    }
    return true; // Devuelve true si ambos campos están completos
  }
  
  
  

  
  async mostrarAlertaConTemporizador() {
    const alert = await this.alertController.create({
      header: 'Logueado con Exito',
      message: 'Será redirigido automáticamente al inicio',
      buttons: ['OK'],
    });
  
    await alert.present();
  
    
    setTimeout(() => {
      alert.dismiss();
      this.router.navigate(['/home']); // Redirige al login
    }, 3000);
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Correo o contraseña incorrectos. Por favor, intente nuevamente.',
      buttons: ['OK'],
    });

    await alert.present();
  
  }
  
}  

