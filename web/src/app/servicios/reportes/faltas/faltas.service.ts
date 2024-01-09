import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FaltasService {

  url!:string;

  constructor(private http: HttpClient) 
  { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  BuscarFaltas(data: any, inicio: string, fin: string) {
    return this.http.put<any>(`${this.url}/reporte-faltas/faltas/${inicio}/${fin}`, data);
  }

  BuscarFaltasRegimenCargo(data: any, inicio: string, fin: string) {
    return this.http.put<any>(`${this.url}/reporte-faltas/faltas-regimen-cargo/${inicio}/${fin}`, data);
  }

}
