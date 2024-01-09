import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // BUSCAR LISTA DE PARAMETROS
  ListarParametros() {
    return this.http.get<any>(`${this.url}/parametrizacion`);
  }

  // ELIMINAR REGISTRO DE PARAMETRO
  EliminarTipoParametro(id: number) {
    return this.http.delete<any>(`${this.url}/parametrizacion/eliminar-tipo/${id}`);
  }

  // ACTUALIZAR REGISTRO PARAMETRO
  ActualizarTipoParametro(datos: any) {
    return this.http.put(`${this.url}/parametrizacion/actual-tipo`, datos);
  }

  // METODO PARA BUSCAR DATOS DE UN PARAMETRO
  ListarUnParametro(id: number) {
    return this.http.get<any>(`${this.url}/parametrizacion/ver-parametro/${id}`);
  }

  // METODO PARA LISTAR DETALLES DE PARAMETRO
  ListarDetalleParametros(id: number) {
    return this.http.get<any>(`${this.url}/parametrizacion/${id}`);
  }

  // METODO PARA ELIMINAR DETALLE DE PARAMETRO
  EliminarDetalleParametro(id: number) {
    return this.http.delete<any>(`${this.url}/parametrizacion/eliminar-detalle/${id}`);
  }

  // METODO PARA REGISTRAR DETALLE DE PARAMETRO
  IngresarDetalleParametro(data: any) {
    return this.http.post(`${this.url}/parametrizacion/detalle`, data);
  }

  // METODO PARA ACTUALIZAR DETALLE DE PARAMETRO
  ActualizarDetalleParametro(datos: any) {
    return this.http.put(`${this.url}/parametrizacion/actual-detalle`, datos);
  }

  // REGISTRAR PARAMETRO
  IngresarTipoParametro(data: any) {
    return this.http.post<any>(`${this.url}/parametrizacion/tipo`, data);
  }

  // METODO PARA COMPARAR CORDENADAS
  ObtenerCoordenadas(data: any) {
    return this.http.post<any>(`${this.url}/parametrizacion/coordenadas`, data);;
  }


  CrearXML(data: any) {
    return this.http.post(`${this.url}/parametrizacion/xmlDownload`, data);
  }



}
