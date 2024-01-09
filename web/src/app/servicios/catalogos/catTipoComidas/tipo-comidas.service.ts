import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TipoComidasService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // Invocación del METODO post para crear nuevo tipo de comida
  CrearNuevoTipoComida(datos: any) {
    return this.http.post<any>(`${this.url}/tipoComidas`, datos);
  }

  ConsultarTipoComida() {
    return this.http.get(`${this.url}/tipoComidas`);
  }

  ConsultarTipoComidaDetalle() {
    return this.http.get(`${this.url}/tipoComidas/detalle`);
  }

  ConsultarUnServicio(id: number) {
    return this.http.get(`${this.url}/tipoComidas/${id}`);
  }


  ConsultarUnMenu(id: number) {
    return this.http.get(`${this.url}/tipoComidas/buscar/menu/${id}`);
  }

  ActualizarUnAlmuerzo(datos: any) {
    return this.http.put(`${this.url}/tipoComidas`, datos);
  }

  CrearXML(data: any) {
    return this.http.post(`${this.url}/tipoComidas/xmlDownload`, data);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/tipoComidas/eliminar/${id}`);
  }

  ObtenerUltimoId() {
    return this.http.get(`${this.url}/tipoComidas/registro/ultimo`);
  }

  // Servicio para consultar datos de tabla detalle_menu
  ConsultarUnDetalleMenu(id: number) {
    return this.http.get(`${this.url}/tipoComidas/detalle/menu/${id}`);
  }

  CrearDetalleMenu(datos: any) {
    return this.http.post(`${this.url}/tipoComidas/detalle/menu`, datos);
  }

  ActualizarDetalleMenu(datos: any) {
    return this.http.put(`${this.url}/tipoComidas/detalle/menu`, datos);
  }

  EliminarDetalleMenu(id: number) {
    return this.http.delete(`${this.url}/tipoComidas/detalle/menu/eliminar/${id}`);
  }

  // Servicios para verificar y subir datos
  subirArchivoExcel(formData) {
    return this.http.post<any>(this.url + '/tipoComidas/upload', formData)
  }

  Verificar_Datos_ArchivoExcel(formData) {
    return this.http.post<any>(this.url + '/tipoComidas/verificar_datos/upload', formData)
  }

  VerificarArchivoExcel(formData) {
    return this.http.post<any>(this.url + '/tipoComidas/verificar_plantilla/upload', formData)
  }
}
