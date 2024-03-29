import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class PeriodoVacacionesService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // BUSCAR ID PERIODO DE VACACIONES
  BuscarIDPerVacaciones(id: number) {
    return this.http.get(`${this.url}/perVacacion/buscar/${id}`);
  }











  // Período de Vacaciones

  ConsultarPerVacaciones() {
    return this.http.get(`${environment.url}/perVacacion`);
  }

  CrearPerVacaciones(datos: any) {
    return this.http.post(`${environment.url}/perVacacion`, datos);
  }


  ObtenerPeriodoVacaciones(codigo: string | number) {
    return this.http.get<any>(`${environment.url}/perVacacion/infoPeriodo/${codigo}`);
  }

  ActualizarPeriodoV(datos: any) {
    return this.http.put(`${environment.url}/perVacacion`, datos);
  }

  // Verificar datos de la plantilla de periodo de vacaciones y luego cargar al sistema
  CargarPeriodosMultiples(formData) {
    return this.http.post<any>(`${environment.url}/perVacacion/cargarPeriodo/upload`, formData);
  }

  VerificarDatos(formData) {
    return this.http.post<any>(`${environment.url}/perVacacion/cargarPeriodo/verificarDatos/upload`, formData);
  }

  VerificarPlantilla(formData) {
    return this.http.post<any>(`${environment.url}/perVacacion/cargarPeriodo/verificarPlantilla/upload`, formData);
  }
}
