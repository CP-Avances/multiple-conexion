import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccionPersonalService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  /** SERVICIOS PARA TABLA TIPO_ACCION_PERSONAL */
  ConsultarTipoAccionPersonal() {
    return this.http.get(`${this.url}/accionPersonal`);
  }

  IngresarTipoAccionPersonal(datos: any) {
    return this.http.post<any>(`${this.url}/accionPersonal`, datos);
  }

  BuscarTipoAccionPersonalId(id: any) {
    return this.http.get(`${this.url}/accionPersonal/tipo/accion/${id}`);
  }

  ActualizarDatos(datos: any) {
    return this.http.put(`${this.url}/accionPersonal`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/accionPersonal/eliminar/${id}`);
  }

  BuscarDatosTipoEdicion(id: any) {
    return this.http.get(`${this.url}/accionPersonal/editar/accion/tipo/${id}`);
  }

  /** SERVICIOS PARA TABLA TIPO_ACCION*/
  ConsultarTipoAccion() {
    return this.http.get(`${this.url}/accionPersonal/accion/tipo`);
  }

  IngresarTipoAccion(datos: any) {
    return this.http.post<any>(`${this.url}/accionPersonal/accion/tipo`, datos);
  }

  BuscarIdTipoAccion() {
    return this.http.get(`${this.url}/accionPersonal/ultimo/accion/tipo`);
  }

  /** SERVICIOS PARA TABLA CARGO_PROPUESTO*/
  ConsultarCargoPropuesto() {
    return this.http.get(`${this.url}/accionPersonal/cargo`);
  }

  ConsultarUnCargoPropuesto(id: number) {
    return this.http.get(`${this.url}/accionPersonal/cargo/${id}`);
  }

  IngresarCargoPropuesto(datos: any) {
    return this.http.post(`${this.url}/accionPersonal/cargo`, datos);
  }

  BuscarIdCargoPropuesto() {
    return this.http.get(`${this.url}/accionPersonal/tipo/cargo`);
  }

  /** SERVICIOS PARA TABLA DECRETO_ACUERDO_RESOLUCION*/
  ConsultarDecreto() {
    return this.http.get(`${this.url}/accionPersonal/decreto`);
  }

  ConsultarUnDecreto(id: number) {
    return this.http.get(`${this.url}/accionPersonal/decreto/${id}`);
  }

  IngresarDecreto(datos: any) {
    return this.http.post(`${this.url}/accionPersonal/decreto`, datos);
  }

  BuscarIdDecreto() {
    return this.http.get(`${this.url}/accionPersonal/tipo/decreto`);
  }

  /** SERVICIOS PARA TABLA PEDIDO_ACCION_EMPLEADO */
  IngresarPedidoAccion(datos: any) {
    return this.http.post(`${this.url}/accionPersonal/pedido/accion`, datos);
  }

  ActualizarPedidoAccion(datos: any) {
    return this.http.put(`${this.url}/accionPersonal/pedido/accion/editar`, datos);
  }

  LogoImagenBase64() {
    return this.http.get<any>(`${this.url}/accionPersonal/logo/ministerio/codificado`);
  }

  /** CONSULTA DE DATOS DE PEDIDOS DE ACCION DE PERSONAL */
  BuscarDatosPedido() {
    return this.http.get(`${this.url}/accionPersonal/pedidos/accion`);
  }

  BuscarDatosPedidoEmpleados(id: any) {
    return this.http.get(`${this.url}/accionPersonal/pedidos/datos/${id}`);
  }

  BuscarDatosPedidoCiudades(id: any){
    return this.http.get(`${this.url}/accionPersonal/pedidos/ciudad/${id}`);
  }

  BuscarDatosPedidoId(id: any) {
    return this.http.get(`${this.url}/accionPersonal/pedido/informacion/${id}`);
  }

  Buscarprocesos(id: any) {
    return this.http.get(`${this.url}/accionPersonal/lista/procesos/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/accionPersonal/xmlDownload`, data);
  }
}
