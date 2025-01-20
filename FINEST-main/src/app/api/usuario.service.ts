import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    })
  };

  constructor(private http: HttpClient) { }

  RegistrarUsuario(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions);
  }

  LoginUsuario(credentials: any): Observable<any> {
    const { email, password } = credentials;
  
    return this.http.get<any[]>(`${this.apiUrl}/usuario`, this.httpOptions).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
  
        if (user) {
          return { success: true, user };
        } else {
          throw new Error('Email o contraseña incorrectos');
        }
      }),
      catchError((error) => {
        return of({ success: false, message: error.message });
      })
    );
  }

  RegistrarPresupuesto(presupuesto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/presupuesto`, presupuesto, this.httpOptions);
  }

  verificarCorreo(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario?email=${email}`).pipe(
      map((usuarios) => usuarios.length > 0)
    );
  }

  registrarGasto(presupuestoId: string, gasto: any): Observable<any> {
    const email = localStorage.getItem('email');
  
    if (!email) {
      return of({ success: false, message: 'No se encontró el email del usuario.' });
    }
  
    const gastoConEmail = {
      ...gasto,
      usuarioEmail: email
    };
  
    return this.http.get<any[]>(`${this.apiUrl}/presupuesto/${presupuestoId}`).pipe(
      map((presupuestos) => {
        const presupuesto = presupuestos.find((p) => p.id === presupuestoId);
  
        if (presupuesto) {
          presupuesto.gastos = presupuesto.gastos || [];
          presupuesto.gastos.push(gastoConEmail);
  
          return this.http.put(`${this.apiUrl}/presupuesto/${presupuestoId}`, presupuesto, this.httpOptions).pipe(
            map((updatedPresupuesto) => updatedPresupuesto)
          );
        } else {
          throw new Error('Presupuesto no encontrado');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al registrar el gasto:', error);
        return of({ success: false, message: error.message });
      })
    );
  }

  obtenerPresupuestosPorEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/presupuesto?email=${email}`, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener los presupuestos:', error);
        return of([]);
      })
    );
  }
}
