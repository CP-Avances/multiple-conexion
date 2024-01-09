import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RegimenService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  /** ** *************************************************************************************** **
   ** ** **                           CONSULTA REGIMEN LABORAL                                ** ** 
   ** ** *************************************************************************************** **/

  // REGISTRAR NUEVO REGIMEN LABORAL
  CrearNuevoRegimen(datos: any) {
    return this.http.post(`${this.url}/regimenLaboral`, datos).pipe(
      catchError(datos));
  }

  // ACTUALIZAR REGISTRO DE REGIMEN LABORAL
  ActualizarRegimen(datos: any) {
    return this.http.put(`${this.url}/regimenLaboral`, datos);
  }

  // LISTAR REGISTROS DE REGIMEN LABORAL
  ConsultarNombresRegimen() {
    return this.http.get(`${this.url}/regimenLaboral/descripcion`);
  }

  // LISTAR REGISTROS DE REGIMEN LABORAL
  ConsultarRegimen() {
    return this.http.get(`${this.url}/regimenLaboral`);
  }

  // BUSCAR UN REGISTRO DE REGIMEN LABORAL
  ConsultarUnRegimen(id: number) {
    return this.http.get(`${this.url}/regimenLaboral/${id}`);
  }

  // ELIMINAR REGISTRO DE REGIMEN LABORAL
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/regimenLaboral/eliminar/${id}`);
  }

  // BUSCAR REGISTRO DE REGIMEN LABORAL POR PAIS
  ConsultarRegimenPais(nombre: string) {
    return this.http.get(`${this.url}/regimenLaboral/pais-regimen/${nombre}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/regimenLaboral/xmlDownload`, data);
  }

  /** ** *************************************************************************************** **
   ** ** **                        CONSULTA PERIODOS DE VACACIONES                            ** ** 
   ** ** *************************************************************************************** **/

  // REGISTRAR NUEVO PERIODO DE VACACIONES
  CrearNuevoPeriodo(datos: any) {
    return this.http.post(`${this.url}/regimenLaboral/periodo-vacaciones`, datos).pipe(
      catchError(datos));
  }

  // ACTUALIZAR REGISTRO PERIODO DE VACACIONES
  ActualizarPeriodo(datos: any) {
    return this.http.put(`${this.url}/regimenLaboral/periodo-vacaciones`, datos);
  }

  // BUSCAR UN REGISTRO DE PERIODO DE VACACIONES
  ConsultarUnPeriodo(id: number) {
    return this.http.get(`${this.url}/regimenLaboral/periodo-vacaciones/${id}`);
  }

  // ELIMINAR REGISTRO DE PERIODO DE VACACIONES
  EliminarPeriodo(id: number) {
    return this.http.delete(`${this.url}/regimenLaboral/periodo-vacaciones/eliminar/${id}`);
  }

  /** ** *************************************************************************************** **
   ** ** **                        CONSULTA ANTIGUEDAD DE VACACIONES                            ** ** 
   ** ** *************************************************************************************** **/

  // REGISTRAR NUEVA ANTIGUEDAD DE VACACIONES
  CrearNuevaAntiguedad(datos: any) {
    return this.http.post(`${this.url}/regimenLaboral/antiguedad-vacaciones`, datos).pipe(
      catchError(datos));
  }

  // ACTUALIZAR REGISTRO ANTIGUEDAD DE VACACIONES
  ActualizarAntiguedad(datos: any) {
    return this.http.put(`${this.url}/regimenLaboral/antiguedad-vacaciones`, datos);
  }

  // BUSCAR UN REGISTRO DE ANTIGUEDAD DE VACACIONES
  ConsultarAntiguedad(id: number) {
    return this.http.get(`${this.url}/regimenLaboral/antiguedad-vacaciones/${id}`);
  }

  // ELIMINAR REGISTRO DE ANTIGUEDAD DE VACACIONES
  EliminarAntiguedad(id: number) {
    return this.http.delete(`${this.url}/regimenLaboral/antiguedad-vacaciones/eliminar/${id}`);
  }









  

  ConsultarRegimenSucursal(id: number) {
    return this.http.get(`${this.url}/regimenLaboral/sucursal-regimen/${id}`);
  }
}
