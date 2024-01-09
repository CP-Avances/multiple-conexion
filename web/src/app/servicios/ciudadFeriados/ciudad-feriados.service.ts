import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class CiudadFeriadosService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }


  // METODO PARA BUSCAR CIUDADES - PROVINCIA POR NOMBRE
  BuscarCiudadProvincia(nombre: string) {
    return this.http.get(`${this.url}/ciudadFeriados/${nombre}`);
  }

  // METODO PARA BUSCAR NOMBRES DE CIUDADES
  BuscarCiudadesFeriado(id: number) {
    return this.http.get(`${this.url}/ciudadFeriados/nombresCiudades/${id}`);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/ciudadFeriados/eliminar/${id}`);
  }

  // METODO PARA BUSCAR ID DE CIUDADES
  BuscarIdCiudad(datos: any) {
    return this.http.post(`${this.url}/ciudadFeriados/buscar`, datos);
  }

  // METODO PARA REGISTRAR ASIGNACION DE CIUDADES A FERIADOS
  CrearCiudadFeriado(datos: any) {
    return this.http.post(`${this.url}/ciudadFeriados/insertar`, datos);
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarDatos(data: any) {
    return this.http.put(`${this.url}/ciudadFeriados`, data);
  }






  // Asignar Ciudad Feriado













  BuscarFeriados(id_ciudad: number) {
    return this.http.get(`${this.url}/ciudadFeriados/ciudad/${id_ciudad}`);
  }

}
