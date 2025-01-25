import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';
import {  Chart,ArcElement,PieController,CategoryScale,Tooltip,Legend,} from 'chart.js';
import { Router } from '@angular/router';




Chart.register(PieController, ArcElement, CategoryScale, Tooltip, Legend);
@Component({
  selector: 'app-presupuesto-save',
  templateUrl: './presupuesto-save.page.html',
  styleUrls: ['./presupuesto-save.page.scss'],
})
export class PresupuestoSavePage implements OnInit, AfterViewInit {
  presupuestos: any[] = [];
  email: string = '';
  gastos: any = {
    monto: '',
    fecha: '',
    descripcion: '',
    tipo: '',
  };

  filtroDescripcion: string = '';
  filtroCategoria: string = '';
  gastosFiltrados: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    public toastController: ToastController,
    public router: Router
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (this.email) {
      this.cargarPresupuestos();
    } else {
      console.log('No se encontró un email.');
      this.presentToast('No se ha encontrado un email en el almacenamiento local.');
    }
  }

  ngAfterViewInit() {
    this.crearGrafico();
  }

  cargarPresupuestos() {
    const emailUsuario = this.email;
    if (emailUsuario) {
      this.usuarioService.obtenerPresupuestosPorEmail(emailUsuario).subscribe(
        (res) => {
          this.presupuestos = res;
          console.log('Presupuestos cargados:', res);
          this.crearGrafico();
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

  filtrarGastos() {
    this.gastosFiltrados = [];

    for (let presupuesto of this.presupuestos) {
      const gastosFiltradosPresupuesto = presupuesto.gastos.filter((gasto: any) => {
        const descripcionCoincide = gasto.descripcion
          .toLowerCase()
          .includes(this.filtroDescripcion.toLowerCase());
        const categoriaCoincide = gasto.categoria
          ? gasto.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())
          : true;

        return descripcionCoincide && categoriaCoincide;
      });

      this.gastosFiltrados = [...this.gastosFiltrados, ...gastosFiltradosPresupuesto];
    }

    console.log('Gastos filtrados:', this.gastosFiltrados);
  }

  crearGrafico() {
    if (!this.presupuestos || this.presupuestos.length === 0) {
      console.error('No hay presupuestos disponibles para crear el gráfico.');
      return;
    }
  
    
    const categorias = this.presupuestos.map((presupuesto) => presupuesto.categoria || 'Sin Categoría');
    const montos = this.presupuestos.map((presupuesto) => {
      if (presupuesto.gastos && Array.isArray(presupuesto.gastos)) {
        return presupuesto.gastos.reduce((total: number, gasto: any) => {
          const monto = typeof gasto.monto === 'number' ? gasto.monto : 0;
          return total + monto;
        }, 0);
      }
      return 0; 
    });
  
    
    const ctx = document.getElementById('graficoCategorias') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie', 
        data: {
          labels: categorias,
          datasets: [
            {
              label: 'Monto:',
              data: montos,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              hoverOffset: 4, 
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top', 
            },
          },
        },
      });
    } else {
      console.error('No se encontró el elemento del canvas para renderizar el gráfico.');
    }
  }

  limpiarFiltro() {
    this.filtroDescripcion = '';
    this.filtroCategoria = '';
    this.gastosFiltrados = [];
    console.log('Filtros limpiados y gastos eliminados.');
  }

  Home(){
    this.router.navigate(['/home']);
  }
}




