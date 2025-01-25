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

  

  RegistrarPresupuesto(presupuesto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/presupuesto`, presupuesto, this.httpOptions);
  }

  verificarCorreo(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario?email=${email}`).pipe(
      map((usuarios) => usuarios.length > 0)
    );
  }

  RegistrarGasto(presupuesto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/gastos`, presupuesto, this.httpOptions);
  }
  
  obtenerPresupuestosPorEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/presupuesto?usuarioEmail=${email}`, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener los presupuestos:', error);
        return of([]);
      })
    );
  }
}
