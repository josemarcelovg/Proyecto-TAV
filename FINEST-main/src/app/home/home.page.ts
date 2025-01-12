import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{

  credentials = {
    email: '',
    password: ''
  };

  userEmail: string | null = '';  
  

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
   
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');  // Recupera la contraseña guardada
    
    if (savedEmail) {
      // Si existe el email, asignarlo a la propiedad userEmail para mostrarlo en la vista
      this.userEmail = savedEmail;
  }
}

}


