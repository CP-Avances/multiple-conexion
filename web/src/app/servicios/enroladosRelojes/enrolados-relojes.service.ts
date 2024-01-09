import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EnroladosRelojesService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  // Asignar Ciudad Feriado

  CrearEnroladoReloj(datos: any) {
    return this.http.post(`${this.url}/enroladosRelojes/insertar`, datos);
  }

  BuscarIdReloj(datos: any) {
    return this.http.post(`${this.url}/enroladosRelojes/buscar`, datos);
  }

  BuscarEnroladosReloj(id: number) {
    return this.http.get(`${this.url}/enroladosRelojes/nombresReloj/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.url}/enroladosRelojes`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/enroladosRelojes/eliminar/${id}`);
  }

}
