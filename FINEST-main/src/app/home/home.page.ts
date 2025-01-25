import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importa el servicio AuthServicew
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
 
})
export class HomePage implements OnInit{

  credentials = {
    email: '',
    password: '',
    nombre: ''
  };

  userNombre: string  = '';  
  

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
     
    const savedNombre = localStorage.getItem('nombre');
    
    if (savedNombre) {
      this.userNombre = savedNombre;
  }
}



presupuesto(){
  this.router.navigate(['/presupuesto']); 
}

logout() {
  this.authService.logout(); 
  this.router.navigate(['/login']); 
}

verpresupuesto(){
  this.router.navigate(['/presupuesto-save'])
}

iniciosesion(){
  this.router.navigate(['/login'])
}

crearcuenta(){
  this.router.navigate(['/registro'])
}
}


