import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresupuestoSavePageRoutingModule } from './presupuesto-save-routing.module';

import { PresupuestoSavePage } from './presupuesto-save.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresupuestoSavePageRoutingModule
  ],
  declarations: [PresupuestoSavePage]
})
export class PresupuestoSavePageModule {}
