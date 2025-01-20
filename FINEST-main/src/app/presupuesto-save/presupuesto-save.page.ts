// presupuesto-save.page.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-presupuesto-save',
  templateUrl: './presupuesto-save.page.html',
  styleUrls: ['./presupuesto-save.page.scss'],
})
export class PresupuestoSavePage implements OnInit {
  presupuesto: any[] = [];  
  usuarioEmail: string = ''; 

  constructor(
    private usuarioService: UsuarioService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.usuarioEmail = localStorage.getItem('email') || '';
    if (this.usuarioEmail) {
      this.cargarPresupuestos();
    } else {
      this.presentToast('No se ha encontrado un email en el almacenamiento local.');
    }
  }

 
  cargarPresupuestos() {
    const emailUsuario = this.usuarioEmail;
    if (emailUsuario) {
      this.usuarioService.obtenerPresupuestosPorEmail(emailUsuario).subscribe(
        (res) => {
          this.presupuesto = res; 
          console.log('Presupuestos cargados:', res);
        },
        (err) => {
          console.error('Error al cargar los presupuestos:', err);
          this.presentToast('Error al cargar los presupuestos.');
        }
      );
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
