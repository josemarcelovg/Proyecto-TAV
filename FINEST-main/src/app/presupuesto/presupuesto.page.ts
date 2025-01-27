import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.page.html',
  styleUrls: ['./presupuesto.page.scss'],
})
export class PresupuestoPage implements OnInit {
  presupuesto: any = {
    nombre: '',
    fecha_inicio: '',
    fecha_corte: '',
    categoria: '',
    usuarioId: '',  // Ahora utilizamos usuarioId en lugar de usuarioEmail
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('id');  // Recuperamos el ID del usuario desde localStorage
    if (userId) {
      this.presupuesto.usuarioId = userId;  // Asignamos el ID al presupuesto
    }
  }

  crearPresupuesto() {
    if (!this.validarDatosPresupuesto()) {
      this.presentToast('Por favor complete todos los datos del presupuesto.');
      return;
    }

    this.usuarioService.registrarPresupuesto(this.presupuesto).subscribe(
      (res) => {
        console.log('Presupuesto guardado exitosamente:', res);
        this.presentToast('Presupuesto guardado correctamente.');
        this.router.navigate(['home'], { state: { presupuestoId: res.id } });  // Navegar a la página de gastos con el ID del presupuesto
      },
      (err) => {
        console.error('Error al guardar el presupuesto:', err);
        this.presentToast('Error al guardar el presupuesto.');
      }
    );
  }

  validarDatosPresupuesto(): boolean {
    return (
      this.presupuesto.nombre.trim() !== '' &&
      this.presupuesto.fecha_inicio.trim() !== '' &&
      this.presupuesto.fecha_corte.trim() !== '' &&
      this.presupuesto.categoria.trim() !== '' 
    );
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }
}