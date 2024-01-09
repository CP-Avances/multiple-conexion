import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VacunasService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  ReporteVacunasMultiples(data: any) {
    console.log('recibiendo data', data)
    return this.http.put<any>(`${this.url}/empleado-vacunas-multiples/vacunas-multiples/`, data);
  }

  ReporteVacunasMultiplesCargoRegimen(data: any) {
    console.log('recibiendo data', data)
    return this.http.put<any>(`${this.url}/empleado-vacunas-multiples/vacunas-multiples-cargos-regimen/`, data);
  }

}
