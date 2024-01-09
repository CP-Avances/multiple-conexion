import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  url!:string;

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  // realtime
  EnviarNotificacionRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.url}/vacaciones/${id}/estado`, datos);
  }

  ObtenerListaVacaciones() {
    return this.http.get(`${this.url}/vacaciones`);
  }

  ObtenerListaVacacionesAutorizadas() {
    return this.http.get(`${this.url}/vacaciones/estado-solicitud`);
  }







  ObtenerVacacionesPorIdPeriodo(id_peri_perido: number) {
    return this.http.get<any>(`${this.url}/vacaciones/${id_peri_perido}`)
  }

  BuscarFechasFeriado(datos: any) {
    return this.http.post(`${this.url}/vacaciones/fechasFeriado`, datos);
  }

  BuscarDatosSolicitud(id_emple_vacacion: number) {
    return this.http.get(`${this.url}/vacaciones/datosSolicitud/${id_emple_vacacion}`);
  }

  BuscarDatosAutorizacion(id_vacaciones: number) {
    return this.http.get(`${this.url}/vacaciones/datosAutorizacion/${id_vacaciones}`);
  }

  EliminarVacacion(id_vacacion: number) {
    return this.http.delete(`${this.url}/vacaciones/eliminar/${id_vacacion}`);
  }





  // REPORTE DE VACACIONES DE FORMA MÚLTIPLE
  BuscarSolicitudVacacion(datos: any, desde: string, hasta: string) {
    return this.http.put(`${this.url}/empleado-vacaciones-solicitudes/vacaciones-solicitudes/${desde}/${hasta}`, datos);
  }

  // BUSQUEDA DE VACACIONES MEDIANTE ID
  ListarUnaVacacion(id: number) {
    return this.http.get(`${this.url}/vacaciones/listar/vacacion/${id}`);
  }


  // BUSQUEDA DE VACACIONES POR ID DE VACACIONES
  ObtenerUnaVacacion(id: number) {
    return this.http.get(`${this.url}/vacaciones/one/${id}`);
  }

  // CREAR SOLICITUD DE VACACIONES
  RegistrarVacaciones(datos: any) {
    return this.http.post<any>(`${this.url}/vacaciones`, datos);
  }

  // EDITAR SOLICITUD DE VACACIONES
  EditarVacacion(id: number, datos: any) {
    return this.http.put<any>(`${this.url}/vacaciones/${id}/vacacion-solicitada`, datos);
  }

  // ENVIAR CORREOS DE SOLICITUDES DE VACACIONES
  EnviarCorreoVacaciones(datos: any) {
    return this.http.post<any>(`${this.url}/vacaciones/mail-noti`, datos);
  }

   // METODO PARA CREAR ARCHIVO XML
   CrearXML(data: any) {
    return this.http.post(`${this.url}/vacaciones/xmlDownload`, data);
  }

}
