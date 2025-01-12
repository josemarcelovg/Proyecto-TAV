import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = 'https://a788db1d-4f2e-4785-85f4-379db9104227-00-3jlgsrdpr9fnm.picard.replit.dev';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    })
  };

  constructor(private http:HttpClient) { }

  RegistrarUsuario(user:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions);
  }

   // Método para iniciar sesión
   LoginUsuario(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, credentials, this.httpOptions);
}
}
