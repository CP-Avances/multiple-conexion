import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class HorasExtrasService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // catalogo de horas extras

  postHoraExtraRest(data: any) {
    return this.http.post<any>(`${this.url}/horasExtras`, data);
  }

  ListarHorasExtras() {
    return this.http.get(`${this.url}/horasExtras`);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/horasExtras/eliminar/${id}`);
  }

  CrearXML(data: any) {
    return this.http.post(`${this.url}/horasExtras/xmlDownload`, data);
  }

  ObtenerUnaHoraExtra(id: number) {
    return this.http.get(`${this.url}/horasExtras/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.url}/horasExtras`, datos);
  }
}
