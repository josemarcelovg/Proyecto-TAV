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
    usuarioEmail: '',
  };

  mostrarFormularioGasto: boolean = false;
  nuevoGasto = {
    monto: '',
    fecha: '',
    descripcion: '',
    tipo: ''  
  }

  gastos: any[] = [];

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService,
    public toastController: ToastController) { }

  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      this.presupuesto.usuarioEmail = email; 
    }
  }

  agregarGasto() {
    if (this.validarGasto()) {
      const email = localStorage.getItem('email');
      if (email) {
        const gastoConEmail = {
          ...this.nuevoGasto,
          usuarioEmail: email
        };
        this.gastos.push(gastoConEmail);
        this.presupuesto.gastos.push(gastoConEmail);
        this.presentToast('Gasto agregado correctamente.');
      } else {
        this.presentToast('No se pudo obtener el email del usuario.');
      }
    } else {
      this.presentToast('Por favor complete todos los datos del gasto.');
    }
  }
  

  crearPresupuesto() {
    if (!this.validarDatosPresupuesto()) {
      this.presentToast('Por favor complete todos los datos del presupuesto.');
      return;
    }
  
    this.presupuesto.gastos = this.gastos; 
  
    this.usuarioService.RegistrarPresupuesto(this.presupuesto).subscribe(
      (res) => {
        console.log('Presupuesto y gastos guardados exitosamente:', res);
        this.presentToast('Presupuesto y gastos guardados correctamente.');
        this.router.navigate(['/presupuesto-save']);
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

  validarGasto(): boolean {
    return (
      this.nuevoGasto.monto.trim() !== '' &&
      this.nuevoGasto.fecha.trim() !== '' &&
      this.nuevoGasto.descripcion.trim() !== '' &&
      this.nuevoGasto.tipo.trim() !== ''
    );
  }

  limpiarCampos() {
    this.nuevoGasto = {
      monto: '',
      fecha: '',
      descripcion: '',
      tipo: '',
    };
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
    });
    toast.present();
  }
}
