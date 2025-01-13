import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.page.html',
  styleUrls: ['./presupuesto.page.scss'],
})
export class PresupuestoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  presupuesto:any={
    nombre:'',
    fecha_inicio:'',
    fecha_corte:'',
  }
}
