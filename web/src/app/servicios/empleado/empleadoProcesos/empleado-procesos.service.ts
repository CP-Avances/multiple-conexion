import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmpleadoProcesosService {

  url!:string;

  constructor(private http: HttpClient) 
  { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  ObtenerListaEmpleProcesos() {
    return this.http.get(`${this.url}/empleadoProcesos`);
  }

  RegistrarEmpleProcesos(datos: any) {
    return this.http.post(`${this.url}/empleadoProcesos`, datos);
  }

  ObtenerProcesoUsuario(id_empl_cargo: number) {
    return this.http.get<any>(`${this.url}/empleadoProcesos/infoProceso/${id_empl_cargo}`);
  }

  ActualizarUnProceso(datos: any) {
    return this.http.put(`${this.url}/empleadoProcesos`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/empleadoProcesos/eliminar/${id}`);
  }

  

}
