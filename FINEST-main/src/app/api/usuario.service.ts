import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  
  registrarUsuario(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions).pipe(
      catchError(this.handleError('RegistrarUsuario'))
    );
  }

  // En el archivo UsuarioService

verificarCredenciales(email: string, password: string): Observable<any> {
  return this.http.get<any[]>(`${this.apiUrl}/usuario?email=${email}&password=${password}`).pipe(
    map((usuarios) => usuarios.length > 0 ? usuarios[0] : null),
    catchError(this.handleError('VerificarCredenciales', null))
  );
}


  
  verificarCorreo(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario?email=${email}`).pipe(
      map((usuarios) => usuarios.length > 0),
      catchError(this.handleError('VerificarCorreo', false))
    );
  }

  
  agregarGasto(gasto: any): Observable<any> {
    const url = `${this.apiUrl}/gastos`;
    return this.http.post(url, gasto, this.httpOptions).pipe(
      catchError(this.handleError('AgregarGasto'))
    );
  }

  
  obtenerGastosPorUsuarioId(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos?usuarioId=${usuarioId}`).pipe(
      catchError(this.handleError('ObtenerGastosPorUsuarioId', []))
    );
  }

  
  obtenerGastoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gastos/${id}`).pipe(
      catchError(this.handleError('ObtenerGastoPorId', null))
    );
  }

  
  obtenerPresupuestosPorUsuarioId(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/presupuesto?usuarioId=${usuarioId}`).pipe(
      catchError(this.handleError('ObtenerPresupuestosPorUsuarioId', []))
    );
  }

  
  registrarPresupuesto(presupuesto: any): Observable<any> {
    const url = `${this.apiUrl}/presupuesto`;
    return this.http.post(url, presupuesto, this.httpOptions).pipe(
      catchError(this.handleError('RegistrarPresupuesto'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
