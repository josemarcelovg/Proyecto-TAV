import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';
import { ChartOptions } from 'chart.js';
import { Chart, ArcElement, PieController, CategoryScale, Tooltip, Legend } from 'chart.js';

// Registramos los elementos necesarios para el gráfico
Chart.register(PieController, ArcElement, CategoryScale, Tooltip, Legend);

@Component({
  selector: 'app-presupuesto-save',
  templateUrl: './presupuesto-save.page.html',
  styleUrls: ['./presupuesto-save.page.scss'],
})
export class PresupuestoSavePage implements OnInit {
  presupuestos: any[] = [];  // Lista de presupuestos que vamos a mostrar
  gastos: any[] = [];  // Lista de gastos asociados al usuario
  filtroDescripcion: string = '';  // Filtro para buscar por nombre de presupuesto
  filtroCategoria: string = '';  // Filtro para buscar por categoría
  presupuestoSeleccionado: any = null;  // Presupuesto seleccionado para mostrar los gastos
  gastosFiltrados: any[] = [];  // Agrega esta propiedad para los gastos filtrados

  // Datos para el gráfico
  public pieChartLabels: string[] = []; // Las categorías
  public pieChartData: number[] = []; // Porcentajes de cada categoría
  public pieChartType: string = 'pie'; // Tipo de gráfico
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let total = 0;
            this.pieChartData.forEach(value => total += value);
  
            // Verificamos si tooltipItem.raw es un número
            const rawValue = tooltipItem.raw as number; // Aseguramos que es de tipo 'number'
            const percentage = Math.round((rawValue / total) * 100);
  
            return tooltipItem.label + ': ' + percentage + '%';
          }
        }
      }
    }
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.obtenerPresupuestos(userId);
      this.obtenerGastos(userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  obtenerPresupuestos(usuarioId: string) {
    this.usuarioService.obtenerPresupuestosPorUsuarioId(usuarioId).subscribe(
      (presupuestos) => {
        this.presupuestos = presupuestos;
      },
      (error) => {
        this.presentToast('Hubo un error al obtener los presupuestos');
        console.error('Error obteniendo los presupuestos', error);
      }
    );
  }

  obtenerGastos(usuarioId: string) {
    this.usuarioService.obtenerGastosPorUsuarioId(usuarioId).subscribe(
      (gastos) => {
        this.gastos = gastos;
        console.log('Gastos obtenidos:', this.gastos); // Verifica los datos de los gastos
        this.gastosFiltrados = gastos;
        this.actualizarGrafico();  // Actualizar el gráfico después de cargar los gastos
      },
      (error) => {
        this.presentToast('Hubo un error al obtener los gastos');
        console.error('Error obteniendo los gastos', error);
      }
    );
  }

  actualizarGrafico() {
    // Filtramos los gastos para asegurarnos de que tengan una categoría válida (no vacía ni nula)
    const gastosConCategoriaValida = this.gastos.filter(gasto => gasto.categoria && gasto.categoria.trim() !== '');
  
    if (gastosConCategoriaValida.length === 0) {
      console.error('No se encontraron gastos con categorías válidas');
    }
  
    // Usamos un Set para obtener las categorías únicas
    const categorias = new Set(gastosConCategoriaValida.map(gasto => gasto.categoria));  
  
    // Mapeamos los datos para cada categoría
    const data = Array.from(categorias).map(categoria => {
      return gastosConCategoriaValida
        .filter(gasto => gasto.categoria === categoria)
        .reduce((total, gasto) => total + gasto.monto, 0);
    });
  
    // Asignamos las etiquetas y los datos
    this.pieChartLabels = Array.from(categorias);  
    this.pieChartData = data;  
  
    console.log('Labels:', this.pieChartLabels);  // Verifica los datos de las etiquetas
    console.log('Data:', this.pieChartData);      // Verifica los datos de las categorías
  
    // Solo crea el gráfico si hay datos para mostrar
    if (this.pieChartLabels.length > 0 && this.pieChartData.length > 0) {
      this.crearGrafico();
    } else {
      console.error('No hay datos para el gráfico.');
    }
  }
  
  // Método para mostrar un mensaje de toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  // Limpiar los filtros
  limpiarFiltros() {
    this.filtroDescripcion = '';
    this.filtroCategoria = '';
    this.obtenerPresupuestos(localStorage.getItem('id') || '');
    this.obtenerGastos(localStorage.getItem('id') || '');
  }

  // Redirigir al inicio
  cancelar() {
    this.router.navigate(['/home']);
  }

  // Método para alternar la visibilidad de los gastos en función del presupuesto seleccionado
  alternarGastos(presupuesto: any) {
    this.presupuestoSeleccionado = this.presupuestoSeleccionado === presupuesto ? null : presupuesto;
  }

  // Método para ver los gastos de un presupuesto
  verGastos(presupuestoId: string) {
    this.gastosFiltrados = this.gastos.filter(gasto => gasto.presupuestoId === presupuestoId);
  }

  // Método para obtener los gastos filtrados por presupuesto
  obtenerGastosPorPresupuesto(presupuestoId: string) {
    return this.gastos.filter(gasto => gasto.presupuestoId === presupuestoId);
  }

  crearGrafico() {
    setTimeout(() => {
      const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.pieChartLabels,  // Usamos las categorías aquí
            datasets: [
              {
                label: 'Monto:',
                data: this.pieChartData,  // Usamos los montos de cada categoría
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],  // Colores de las secciones
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    let total = 0;
                    this.pieChartData.forEach(value => total += value);
                    const rawValue = tooltipItem.raw as number;
                    const percentage = Math.round((rawValue / total) * 100);
                    return tooltipItem.label + ': ' + percentage + '%';
                  },
                },
              },
            },
          },
        });
      } else {
        console.error('No se encontró el canvas con id "pieChart"');
      }
    }, 0);  // Esto asegura que el DOM haya sido completamente actualizado
  }
  
}
