import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresupuestoSavePage } from './presupuesto-save.page';

describe('PresupuestoSavePage', () => {
  let component: PresupuestoSavePage;
  let fixture: ComponentFixture<PresupuestoSavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
