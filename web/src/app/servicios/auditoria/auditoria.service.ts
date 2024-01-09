import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // catalogo de departamentos

  ConsultarAuditoria(data: any) {
    return this.http.post(`${this.url}/reportes-auditoria/auditar`, data);
  }

}
