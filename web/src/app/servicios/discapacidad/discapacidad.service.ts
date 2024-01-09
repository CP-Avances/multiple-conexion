import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DiscapacidadService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA BUSCAR DATOS DE UN USUARIO
  BuscarDiscapacidadUsuario(id: number) {
    return this.http.get(`${this.url}/discapacidad/${id}`);
  }

  // METODO PARA REGISTRAR DISCAPACIDAD
  RegistroDiscapacidad(data: any) {
    return this.http.post(`${this.url}/discapacidad`, data);
  }

  // METODO PARA ACTUALIZACION DE REGISTRO
  ActualizarDiscapacidad(id: number, data: any) {
    return this.http.put(`${this.url}/discapacidad/${id}`, data);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarDiscapacidad(id: number) {
    return this.http.delete(`${this.url}/discapacidad/eliminar/${id}`);
  }


  /** *************************************************************************************** **
   ** **                METODO PARA MANEJO DE DATOS DE TIPO DISCAPACIDAD                   ** ** 
   ** *************************************************************************************** **/

  // METODO PARA REGISTRAR TIPO DE DISCAPACIDAD
  RegistrarTipo(data: any) {
    return this.http.post<any>(`${this.url}/discapacidad/buscarTipo`, data);
  }

  // BUSCAR TIPO DE DISCAPACIDAD
  ListarTipoDiscapacidad() {
    return this.http.get(`${this.url}/discapacidad/buscarTipo/tipo`);
  }
















  // TIPO DE DISCAPACIDAD



  BuscarTipoD(id: number) {
    return this.http.get(`${this.url}/discapacidad/buscarTipo/tipo/${id}`);
  }



  ActualizarTipoD(id: number, data: any) {
    return this.http.put(`${this.url}/discapacidad/buscarTipo/${id}`, data);
  }



}
