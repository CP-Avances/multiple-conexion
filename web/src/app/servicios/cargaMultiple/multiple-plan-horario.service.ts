import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MultiplePlanHorarioService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  CargarArchivoExcel(formData) {
    return this.http.post(`${this.url}/cargaMultiple/upload`, formData)
  }
  CargarHorarioFijoVarios(formData) {
    return this.http.post(`${this.url}/cargaMultiple/horarioFijo/upload`, formData)
  }
}
