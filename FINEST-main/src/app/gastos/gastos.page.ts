import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  gasto: any = {
    descripcion: '',
    monto: 0,
    fecha: '',
    categoria: '',
    presupuestoId: '',  // Asociar el gasto con el presupuestoId
    imagen: null,
    imagenPreview: null
  };

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtener el ID del presupuesto desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['presupuestoId']) {
      this.gasto['presupuestoId'] = navigation.extras.state['presupuestoId'];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.gasto.imagen = file;
        this.gasto.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarGasto() {
    if (!this.validarDatosGasto()) {
      this.presentToast('Por favor complete todos los datos del gasto.');
      return;
    }

    this.usuarioService.agregarGasto(this.gasto).subscribe(
      (res) => {
        console.log('Gasto agregado exitosamente:', res);
        this.presentToast('Gasto agregado correctamente.');
        this.router.navigate(['/home']);  // Redirigir después de agregar el gasto
      },
      (err) => {
        console.error('Error al agregar el gasto:', err);
        this.presentToast('Error al agregar el gasto.');
      }
    );
  }

  validarDatosGasto(): boolean {
    return (
      this.gasto.descripcion.trim() !== '' &&
      this.gasto.monto > 0 &&
      this.gasto.fecha.trim() !== '' &&
      this.gasto.tipo.trim() !== ''
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
