import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user:any={
    nombre:'',
    email:'',
    password:'',
    f_nacimiento:'',
    genero:''
  }
  
 
  constructor(private usuarioService:UsuarioService,
               private router:Router) {}

  ngOnInit() {
  }

  registrar(){

    
      
      if (!this.validarCampos()) {
        alert('Por favor, complete todos los campos antes de registrar ');
        return;
      }
    console.log('Registrando ...');
    console.log(this.user.nombre);
 
    this.usuarioService.RegistrarUsuario(this.user).subscribe(
      (res) => {
        console.log('Registro exitoso:', res);

       
        localStorage.setItem('email', this.user.email);
        localStorage.setItem('password', this.user.password);

        this.limpiarCampos();
        
        this.router.navigate(['/login']);
      },
      (err)=>{
        console.log('porfavor ingrese bien sus datos',err);
      }
    );
  }
  
    limpiarCampos() {
      
      this.user = {
        nombre: '',
        email: '',
        password: '',
        f_nacimiento: '',
        genero: ''
      };
    }

    validarCampos(): boolean {
      return (
        this.user.nombre.trim() !== '' &&
        this.user.email.trim() !== '' &&
        this.user.password.trim() !== '' &&
        this.user.f_nacimiento.trim() !== '' &&
        this.user.genero.trim() !== ''
      );
    }
  }

