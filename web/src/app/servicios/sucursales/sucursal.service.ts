import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  // BUSCAR SUCURSALES POR EL NOMBRE
  BuscarNombreSucursal(nombre: any) {
    return this.http.post(`${this.url}/sucursales/nombre-sucursal`, nombre);
  }

  // GUARDAR DATOS DE REGISTRO
  RegistrarSucursal(data: any) {
    return this.http.post<any>(`${this.url}/sucursales`, data);
  }

  // ACTUALIZAR REGISTRO
  ActualizarSucursal(datos: any) {
    return this.http.put(`${this.url}/sucursales`, datos);
  }

  // BUSCAR SUCURSAL POR ID DE EMPRESA
  BuscarSucursalEmpresa(id_empresa: number) {
    return this.http.get(`${this.url}/sucursales/empresa-sucursal/${id_empresa}`);
  }

  // BUSCAR LISTA DE SUCURSALES
  BuscarSucursal() {
    return this.http.get(`${this.url}/sucursales`);
  }

  // METODO PARA ELIMINAR REGISTRO 
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/sucursales/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/sucursales/xmlDownload`, data);
  }

  // METODO PARA BUSCAR DATOS DE UNA SUCURSAL
  BuscarUnaSucursal(id: number) {
    return this.http.get(`${this.url}/sucursales/unaSucursal/${id}`);
  }


}
