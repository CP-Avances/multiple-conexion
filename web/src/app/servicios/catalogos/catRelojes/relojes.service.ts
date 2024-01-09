import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RelojesService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA LISTAR DISPOSITIVOS
  ConsultarRelojes() {
    return this.http.get(`${this.url}/relojes`);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/relojes/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/relojes/xmlDownload`, data);
  }

  // METODO PARA REGISTRAR DISPOSITIVO
  CrearNuevoReloj(datos: any) {
    return this.http.post<any>(`${this.url}/relojes`, datos);
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarDispositivo(datos: any) {
    return this.http.put<any>(`${this.url}/relojes`, datos);
  }

  // METODO PARA CONSULTAR DATOS GENERALES DE DISPOSITIVO
  ConsultarDatosId(id: number) {
    return this.http.get(`${this.url}/relojes/datosReloj/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXMLIdDispositivos(data: any) {
    return this.http.post(`${this.url}/relojes/xmlDownloadIdDispositivos`, data);
  }










  ConsultarUnReloj(id: number) {
    return this.http.get(`${this.url}/relojes/${id}`);
  }













  // METODOs para verificar datos de plantilla antes de registralos en el sistema
  subirArchivoExcel(formData) {
    return this.http.post<any>(`${this.url}/relojes/plantillaExcel/`, formData);
  }

  Verificar_Datos_ArchivoExcel(formData) {
    return this.http.post<any>(`${this.url}/relojes/verificar_datos/plantillaExcel/`, formData);
  }

  VerificarArchivoExcel(formData) {
    return this.http.post<any>(`${this.url}/relojes/verificar_plantilla/plantillaExcel/`, formData);
  }
}
