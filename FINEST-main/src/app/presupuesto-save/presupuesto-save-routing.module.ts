import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresupuestoSavePage } from './presupuesto-save.page';

const routes: Routes = [
  {
    path: '',
    component: PresupuestoSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresupuestoSavePageRoutingModule {}
