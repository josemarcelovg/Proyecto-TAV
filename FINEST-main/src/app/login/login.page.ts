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
   
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail && savedPassword) {
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
        this.mostrarAlertaConTemporizador();
      },
      (err) => {
        console.error('Error al iniciar sesión:', err);
        this.mostrarAlertaError(); 
      }
    );
  }

  validarCredentials(): boolean {
    if (
      this.credentials.email.trim() === '' || 
      this.credentials.password.trim() === ''
    ) {
      
      alert('Por favor, ingrese su correo electrónico y contraseña para continuar.');
      return false; 
    }
    return true; 
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
      this.router.navigate(['/home']); 
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

