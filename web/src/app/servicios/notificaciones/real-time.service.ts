import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Socket, SocketIoConfig} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  url!:string;

  constructor(
    private http: HttpClient,
    private socket: Socket,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
    
    //esto permite cambiar el url del socket para utilizar la conexion con otra url.
    this.socket.emptyConfig.url = this.url
  }

  // METODO PARA RECIBIR NOTIFICACION DE AVISOS EN TIEMPO REAL
  RecibirNuevosAvisos(data: any) {
    this.socket.emit('nuevo_aviso', data);
  }

  // METODO DE BUSQUEDA DE CONFIGURACION DE RECEPCION DE NOTIFICACIONES
  ObtenerConfiguracionEmpleado(id_empleado: number) {
    return this.http.get<any>(`${this.url}/noti-real-time/config/${id_empleado}`);
  }

  // METODO PARA INGRESAR NOTIFICACIONES DE PERMISOS
  IngresarNotificacionEmpleado(datos: any) {
    return this.http.post<any>(`${this.url}/noti-real-time`, datos);
  }


  ObtenerTodasNotificaciones() {
    return this.http.get(`${this.url}/noti-real-time/`);
  }

  ObtenerUnaNotificacion(id: number) {
    return this.http.get<any>(`${this.url}/noti-real-time/one/${id}`);
  }

  ObtenerNotificacionesSend(id_empleado: number) {
    return this.http.get(`${this.url}/noti-real-time/send/${id_empleado}`);
  }



  ObtenerNotificacionesAllReceives(id_empleado: number) {
    return this.http.get(`${this.url}/noti-real-time/all-receives/${id_empleado}`);
  }


  PutVistaNotificacion(id_realtime: number) {
    let data = { visto: true };
    return this.http.put(`${this.url}/noti-real-time/vista/${id_realtime}`, data);
  }

  EliminarNotificaciones(Seleccionados: any[]) {
    return this.http.put<any>(`${this.url}/noti-real-time/eliminar-multiples/avisos`, Seleccionados); //Eliminacion de datos seleccionados.
  }


  /** ************************************************************************************ **
   ** **                        METODOS PARA CONFIG_NOTI                                ** ** 
   ** ************************************************************************************ **/


  IngresarConfigNotiEmpleado(datos: any) {
    return this.http.post(`${this.url}/noti-real-time/config`, datos);
  }

  ActualizarConfigNotiEmpl(id_empleado: number, datos: any) {
    return this.http.put(`${this.url}/noti-real-time/config/noti-put/${id_empleado}`, datos);
  }

  // METODO PARA BUSCAR NOTIFICACIONES RECIBIDAS POR UN USUARIO
  ObtenerNotasUsuario(id_empleado: number) {
    return this.http.get(`${this.url}/noti-real-time/receives/${id_empleado}`);
  }

  // METODO PARA ENVIO DE CORREO MULTIPLE
  EnviarCorreoMultiple(datos: any) {
    console.log('datos: ',datos);
    return this.http.post<any>(`${this.url}/noti-real-time/mail-multiple`, datos);
  }


  







  /** ************************************************************************************ **
   ** **                 METODOS DE CONSULTA DE DATOS DE COMUNICADOS                    ** ** 
   ** ************************************************************************************ **/

  // METODO PARA ENVIO DE CORREO DE COMUNICADOS
  EnviarCorreoComunicado(datos: any) {
    return this.http.post<any>(`${this.url}/noti-real-time/mail-comunicado`, datos);
  }

  // METODO PARA ENVIO DE NOTIFICACION DE COMUNICADOS
  EnviarMensajeGeneral(data: any) {
    return this.http.post<any>(`${this.url}/noti-real-time/noti-comunicado/`, data);
  }

}
