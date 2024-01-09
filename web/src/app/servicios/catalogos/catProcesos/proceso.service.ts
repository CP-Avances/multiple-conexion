import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // catalogo de Procesos

  getProcesosRest() {
    return this.http.get(`${this.url}/proceso`);
  }

  getOneProcesoRest(id: number) {
    return this.http.get(`${this.url}/proceso/${id}`);
  }

  postProcesoRest(data: any) {
    return this.http.post(`${this.url}/proceso`, data);
  }

  deleteProcesoRest(id: number){
    return this.http.delete(`${this.url}/proceso/eliminar/${id}`);
  }

  getIdProcesoPadre(procesoPadre: string) {
    return this.http.get(`${this.url}/proceso/busqueda/${procesoPadre}`);
  }

  ActualizarUnProceso(datos: any) {
    return this.http.put(`${this.url}/proceso`, datos);
  }

  CrearXML(data: any) {
    return this.http.post(`${this.url}/proceso/xmlDownload`, data);
  }

}
