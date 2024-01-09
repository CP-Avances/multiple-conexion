import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ConexionDataBaseService {

  constructor(
    private http: HttpClient,
  ) { }

  ObtenerDataBase(nombre: string) {
    return this.http.get(`${environment.url1}/conexionDataBases/dataBase/${nombre}`);
  }
}
