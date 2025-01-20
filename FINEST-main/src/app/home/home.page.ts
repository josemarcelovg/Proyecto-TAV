import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
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

  userNombre: string | null = '';  
  

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');  
    const savedNombre = localStorage.getItem('nombre');
    
    if (savedNombre) {
      this.userNombre = savedNombre;
  }
}

presupuesto(){
  this.router.navigate(['/presupuesto']); 
}
}


