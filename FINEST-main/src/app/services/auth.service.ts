import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuario';

  constructor(
    private http: HttpClient,
    private router: Router,
    public toastController: ToastController
  ) {}

  async authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(this.apiUrl, { email, password })
      );

      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('id', response.user.id);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('nombre', response.user.nombre);
        return true;
      } else {
        console.error('Credenciales incorrectas');
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
    localStorage.removeItem('id');

    if (
      !localStorage.getItem('user') &&
      !localStorage.getItem('email') &&
      !localStorage.getItem('password') &&
      !localStorage.getItem('id')
    ) {
      console.log('Todos los datos han sido borrados correctamente.');
      this.presentToast('Se ha cerrado sesión con éxito.');
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
