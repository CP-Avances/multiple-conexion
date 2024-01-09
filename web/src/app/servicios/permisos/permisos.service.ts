import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  url!:string;

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // ENVIO DE NOTIFICACIONES DE PERMISOS EN TIEMPO REAL
  EnviarNotificacionRealTime(data: any) {
    this.socket.emit('nueva_notificacion', data);
  }

  // METODO DE BUSQUEDA DEL NUMERO DE PERMISO
  BuscarNumPermiso(id: number) {
    return this.http.get(`${this.url}/empleadoPermiso/numPermiso/${id}`);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS 
  BuscarPermisosSolicitadosTotales(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados-totales`, datos);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS POR DIAS
  BuscarPermisosSolicitadosDias(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados`, datos);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS POR DIAS
  BuscarPermisosSolicitadosHoras(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados-horas`, datos);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS ACTUALIZAR
  BuscarPermisosSolicitadosTotalesEditar(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados-totales-editar`, datos);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS POR DIAS ACTUALIZAR
  BuscarPermisosSolicitadosDiasEditar(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados-editar`, datos);
  }

  // METODO PARA BUSCAR PERMISOS SOLICITADOS POR DIAS ACTUALIZAR
  BuscarPermisosSolicitadosHorasEditar(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/permisos-solicitados-horas-editar`, datos);
  }

  // METODO PARA REGISTRAR SOLICITUD DE PERMISO
  IngresarEmpleadoPermisos(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso`, datos);
  }

  // METODO USADO PAR EDITAR DATOS DE PERMISO
  EditarPermiso(id: number, datos: any) {
    return this.http.put<any>(`${this.url}/empleadoPermiso/${id}/permiso-solicitado`, datos);
  }

  // METODO USADO PAR ELIMINAR DATOS DE PERMISO
  EliminarDocumentoPermiso(datos: any) {
    return this.http.put<any>(`${this.url}/empleadoPermiso/eliminar-documento`, datos);
  }

  // SUBIR RESPALDOS DE PERMISOS
  SubirArchivoRespaldo(formData: any, id: number, codigo: any, archivo: any) {
    return this.http.put(`${this.url}/empleadoPermiso/${id}/archivo/${archivo}/validar/${codigo}`, formData)
  }




  // METODO DE BUSQUEDA DE PERMISOS POR ID DE EMPLEADO
  BuscarPermisoEmpleado(id_empleado: any) {
    return this.http.get(`${this.url}/empleadoPermiso/permiso-usuario/${id_empleado}`);
  }

  // METODO PARA BUSCAR INFORMACION DE UN PERMISO
  ObtenerInformeUnPermiso(id_permiso: number) {
    return this.http.get(`${this.url}/empleadoPermiso/informe-un-permiso/${id_permiso}`);
  }

  // METODO PARA ELIMINAR PERMISOS
  EliminarPermiso(id_permiso: number, doc: string, codigo: number) {
    return this.http.delete<any>(`${this.url}/empleadoPermiso/eliminar/${id_permiso}/${doc}/verificar/${codigo}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/empleadoPermiso/xmlDownload`, data);
  }

  // METODO PARA ENVIAR NOTIFICACION DE PERMISOS
  EnviarCorreoWeb(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/mail-noti`, datos);
  }

  // METODO PARA ENVIAR NOTIFICACION DE PERMISOS EDICION
  EnviarCorreoEditarWeb(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/mail-noti-editar`, datos);
  }

  // METODO PARA ENVIAR NOTIFICACION DE PERMISOS
  EnviarCorreoWebMultiple(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoPermiso/mail-noti/solicitud-multiple`, datos);
  }










  // Permisos Empleado

  obtenerAllPermisos() {
    return this.http.get(`${this.url}/empleadoPermiso/lista`);
  }

  BuscarPermisosAutorizados() {
    return this.http.get(`${this.url}/empleadoPermiso/lista-autorizados`);
  }

  obtenerUnPermisoEmpleado(id_permiso: number) {
    return this.http.get(`${this.url}/empleadoPermiso/un-permiso/${id_permiso}`);
  }

  ActualizarEstado(id: number, datos: any) {
    return this.http.put(`${this.url}/empleadoPermiso/${id}/estado`, datos);
  }

  ConsultarEmpleadoPermisos() {
    return this.http.get(`${this.url}/empleadoPermiso`);
  }


  ObtenerUnPermiso(id: number) {
    return this.http.get(`${this.url}/empleadoPermiso/${id}`)
  }

  ObtenerUnPermisoEditar(id: number) {
    return this.http.get(`${this.url}/empleadoPermiso/permiso/editar/${id}`)
  }


  BuscarPermisoContrato(id: any) {
    return this.http.get(`${this.url}/empleadoPermiso/permisoContrato/${id}`);
  }

  BuscarDatosSolicitud(id_emple_permiso: number) {
    return this.http.get(`${this.url}/empleadoPermiso/datosSolicitud/${id_emple_permiso}`);
  }

  BuscarDatosAutorizacion(id_permiso: number) {
    return this.http.get(`${this.url}/empleadoPermiso/datosAutorizacion/${id_permiso}`);
  }



  BuscarFechasPermiso(datos: any, codigo: number) {
    return this.http.post(`${this.url}/empleadoPermiso/fechas_permiso/${codigo}`, datos);
  }














}
