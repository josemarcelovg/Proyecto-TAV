import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuario';  // Ruta a tu archivo db.json

  constructor(private http: HttpClient, private router: Router,  public toastController: ToastController) { }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }


  async login(email: string, password: string): Promise<any[]> {
    try {
      
      const usuarios = await this.http.get<any[]>(this.apiUrl).toPromise();
      
      if (!Array.isArray(usuarios)) {
        console.error('La respuesta no es un arreglo válido');
        return [];  
      }
  
      return usuarios; 
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al autenticar usuario');
    }
  }
  
  async authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      const usuarios = await this.login(email, password);
  
      
      if (!Array.isArray(usuarios)) {
        console.error('Los usuarios no son un arreglo válido');
        return false;
      }
  
     
      const usuario = usuarios.find((user: any) => user.email === email && user.password === password);
  
      if (usuario) {
        localStorage.setItem('user', JSON.stringify(usuario)); 
        return true;
      } else {
        console.error('No se encontró el usuario con las credenciales proporcionadas');
        return false; 
      }
  
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      return false; 
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('email'); 
    localStorage.removeItem('password'); 
    
    this.router.navigate(['/login']);
    if (!localStorage.getItem('user') && !localStorage.getItem('email') && !localStorage.getItem('password')) {
      console.log('Todos los datos han sido borrados correctamente.');
      this.presentToast('Se ha cerrado sesion con exito.');
    } else {
      console.log('Algunos datos no se borraron.');
    }
  
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }
}