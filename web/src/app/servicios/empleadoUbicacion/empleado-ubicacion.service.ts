import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoUbicacionService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  /** ***************************************************************************************** **
   ** **              CONSULTAS DE COORDENADAS GENERALES DE UBICACION DE USUARIO             ** **
   ** ***************************************************************************************** **/

  // METODO PARA LISTAR COORDENADAS DE UN USUARIO
  ListarCoordenadasUsuario(id_empl: number) {
    return this.http.get(`${this.url }/ubicacion/coordenadas-usuario/${id_empl}`);
  }

  RegistrarCoordenadasUsuario(data: any) {
    return this.http.post<any>(`${this.url}/ubicacion/coordenadas-usuario`, data);
  }

  ListarCoordenadasUsuarioU(id_ubicacion: number) {
    return this.http.get(`${this.url }/ubicacion/coordenadas-usuarios/general/${id_ubicacion}`);
  }

  EliminarCoordenadasUsuario(id: number) {
    return this.http.delete<any>(`${this.url }/ubicacion/eliminar-coordenadas-usuario/${id}`);
  }


  /** ***************************************************************************************** **
   ** **             ACCESO A RUTAS DE COORDENADAS GENERALES DE UBICACIÓN                     ** **
   ** ***************************************************************************************** **/

  RegistrarCoordenadas(data: any) {
    return this.http.post<any>(`${this.url }/ubicacion`, data);
  }

  ActualizarCoordenadas(data: any) {
    return this.http.put(`${this.url }/ubicacion`, data);
  }

  ListarCoordenadas() {
    return this.http.get(`${this.url}/ubicacion`);
  }

  ListarCoordenadasEspecificas(id: number) {
    return this.http.get(`${this.url }/ubicacion/especifico/${id}`);
  }

  ListarUnaCoordenada(id: number) {
    return this.http.get<any>(`${this.url }/ubicacion/determinada/${id}`);
  }

  ConsultarUltimoRegistro() {
    return this.http.get(`${this.url }/ubicacion/ultimo-registro`);
  }

  EliminarCoordenadas(id: number) {
    return this.http.delete<any>(`${this.url }/ubicacion/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url }/ubicacion/xmlDownload`, data);
  }
}
