import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AtrasosService {

  url!:string;

  constructor(private http: HttpClient) 
  { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  ReporteAtrasos(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${this.url}/reporte-atrasos/atrasos-empleados/${desde}/${hasta}`, data);
  }

  ReporteAtrasosRegimenCargo(data: any, desde: string, hasta: string) {
    return this.http.put<any>(`${this.url}/reporte-atrasos/atrasos-empleados-regimen-cargo/${desde}/${hasta}`, data);
  }
}
