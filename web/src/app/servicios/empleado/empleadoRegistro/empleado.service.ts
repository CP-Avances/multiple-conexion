import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  url!:string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }


  /** ** ********************************************************************************************* **
   ** ** **                        MANEJO DE CODIGOS DE USUARIOS                                    ** **
   ** ** ********************************************************************************************* **/

  // METODO PARA BUSCAR CONFIGURACION DE CODIGO DE USUARIO
  ObtenerCodigo() {
    return this.http.get(`${this.url}/empleado/encontrarDato/codigo`);
  }

  // METODO PRA REGISTRAR CODIGO DE USUARIO
  CrearCodigo(datos: any) {
    return this.http.post(`${this.url}/empleado/crearCodigo`, datos);
  }

  // METODO DE BUSQUEDA DEL ULTIMO CODIGO REGISTRADO EN EL SISTEMA
  ObtenerCodigoMAX() {
    return this.http.get(`${this.url}/empleado/encontrarDato/codigo/empleado`);
  }

  // METODO PARA ACTUALIZAR VALOR DE CODIGO
  ActualizarCodigoTotal(datos: any) {
    return this.http.put(`${this.url}/empleado/cambiarValores`, datos);
  }

  // METODO DE ACTUALIZACION DE CODIGO DE USUARIO
  ActualizarCodigo(datos: any) {
    return this.http.put(`${this.url}/empleado/cambiarCodigo`, datos);
  }


  /** ********************************************************************************************** **
   ** **                     METODO PARA MANEJAR DATOS DE EMPLEADO                                ** ** 
   ** ********************************************************************************************** **/

  // BUSCAR UN REGISTRO DE USUARIO  --**VERIFICADO
  BuscarUnEmpleado(id: number) {
    return this.http.get<any>(`${this.url}/empleado/${id}`);
  }

  // BUSCAR LISTA DE EMPLEADOS
  BuscarListaEmpleados() {
    return this.http.get<any>(`${this.url}/empleado/buscador/empleado`);
  }

  // REGISTRAR EMPLEADOS
  RegistrarEmpleados(data: any) {
    return this.http.post(`${this.url}/empleado`, data).pipe(
      catchError(data));
  }

  // ACTUALIZAR EMPLEADOS
  ActualizarEmpleados(data: any, id: number) {
    return this.http.put(`${this.url}/empleado/${id}/usuario`, data).pipe(
      catchError(data));
  }

  // SERVICIO PARA OBTENER LISTA DE NACIONALIDADES
  BuscarNacionalidades() {
    return this.http.get<any>(`${this.url}/nacionalidades`)
  }

  // METODO PARA LISTAR EMPLEADOS ACTIVOS
  ListarEmpleadosActivos() {
    return this.http.get(`${this.url}/empleado`);
  }

  // METODO PARA LISTAR EMPLEADOS DESACTIVADOS
  ListaEmpleadosDesactivados() {
    return this.http.get<any>(`${this.url}/empleado/desactivados/empleados`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/empleado/xmlDownload`, data);
  }

  // DESACTIVAR VARIOS EMPLEADOS SELECCIONADOS
  DesactivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.url}/empleado/desactivar/masivo`, data)
  }

  // ACTIVAR VARIOS EMPLEADOS
  ActivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.url}/empleado/activar/masivo`, data)
  }

  // METODO PARA REACTIVAR USUARIOS
  ReActivarVariosUsuarios(data: any[]) {
    return this.http.put<any>(`${this.url}/empleado/re-activar/masivo`, data)
  }

  // METODO PARA CARGAR IMAGEN DEL USUARIO
  SubirImagen(formData: any, idEmpleado: number) {
    return this.http.put(`${this.url}/empleado/${idEmpleado}/uploadImage`, formData)
  }

  obtenerImagen(id: any, imagen: any){
    return this.http.get<any>(`${this.url}/empleado/img/codificado/${id}/${imagen}`)
  }


  /** *********************************************************************** **
   ** **       METODOS PARA MANEJO DE DATOS DE TITULO PROFESIONAL             **
   ** *********************************************************************** **/

  // METODO PARA BUSCAR TITULO DE EMPLEADO
  BuscarTituloUsuario(id: number) {
    return this.http.get(`${this.url}/empleado/emplTitulos/${id}`);
  }

  // METODO PARA REGISTRAR TITULO PROFESIONAL
  RegistrarTitulo(data: any) {
    return this.http.post(`${this.url}/empleado/emplTitulos`, data);
  }

  ActualizarTitulo(id: number, data: any) {
    return this.http.put(`${this.url}/empleado/${id}/titulo`, data);
  }

  // METODO DE ELIMINACION DE TITULO DE EMPLEADO
  EliminarTitulo(id: number) {
    return this.http.delete(`${this.url}/empleado/eliminar/titulo/${id}`);
  }


  /** *********************************************************************** **
   ** **         CONTROL DE GEOLOCALIZACION EN EL SISTEMA                     **
   ** *********************************************************************** **/

  // METODO PARA ACTUALIZAR UBICACION DE DOMICILIO
  ActualizarDomicilio(id: number, data: any) {
    return this.http.put<any>(`${this.url}/empleado/geolocalizacion/${id}`, data)
  }

  // METODO PARA OBTENER LA UBICACION DE DOMICILIO DEL USUARIO
  BuscarUbicacion(id: number) {
    return this.http.get<any>(`${this.url}/empleado/ubicacion/${id}`);
  }
  

  /** **************************************************************************************** **
   ** **                 METODOS MODALIDAD DE TRABAJO O TIPO DE CONTRATOS                   ** **
   ** **************************************************************************************** **/

  // BUSCAR LISTA MODALIDAD DE TRABAJO
  BuscarTiposContratos() {
    return this.http.get<any>(`${this.url}/contratoEmpleado/modalidad/trabajo`);
  }

  // REGISTRAR MODALIDAD DE TRABAJO
  CrearTiposContrato(datos: any) {
    return this.http.post<any>(`${this.url}/contratoEmpleado/modalidad/trabajo`, datos);
  }


  /** ***************************************************************************************** ** 
   ** **                        MANEJO DE DATOS DE CONTRATOS                                 ** ** 
   ** ***************************************************************************************** **/

  // REGISTRO DE DATOS DE CONTRATO
  CrearContratoEmpleado(datos: any) {
    return this.http.post<any>(`${this.url}/contratoEmpleado`, datos);
  }

  // CARGAR DOCUMENTO CONTRATO
  SubirContrato(formData: any, id: number) {
    return this.http.put(`${this.url}/contratoEmpleado/${id}/documento-contrato`, formData)
  }

  // BUSCAR CONTRATOS POR ID DE EMPLEADO
  BuscarContratosEmpleado(id: number) {
    return this.http.get<any>(`${this.url}/contratoEmpleado/contrato-empleado/${id}`);
  }

  // EDITAR DATOS DE CONTRATO
  ActualizarContratoEmpleado(id: number, data: any) {
    return this.http.put(`${this.url}/contratoEmpleado/${id}/actualizar/`, data);
  }

  // ELIMINAR DOCUMENTO DE CONTRATO
  EliminarArchivo(datos: any) {
    return this.http.put(`${this.url}/contratoEmpleado/eliminar_contrato/base_servidor`, datos)
  }

  // ELIMINAR DOCUMENTO DE CONTRATO DEL SERVIDOR
  EliminarArchivoServidor(datos: any) {
    return this.http.put(`${this.url}/contratoEmpleado/eliminar_contrato/servidor`, datos)
  }

  // VISUALIZAR DOCUMENTO CONTRATO
  ObtenerUnContrato(id: number) {
    return this.http.get(`${this.url}/contratoEmpleado/${id}/get`);
  }

  // METODO PARA BUSCAR ID DE CONTRATO ACTUAL
  BuscarIDContratoActual(id: number) {
    return this.http.get(`${this.url}/contratoEmpleado/contratoActual/${id}`);
  }

  // METODO PARA BUSCAR DATOS DE CONTRATO POR ID
  BuscarDatosContrato(id: number) {
    return this.http.get<any>(`${this.url}/contratoEmpleado/contrato/${id}`);
  }

  // METODO PARA BUSCAR FECHA DE CONTRATOS   --**VERIFICADO
  BuscarFechaContrato(datos: any) {
    return this.http.post(`${this.url}/contratoEmpleado/buscarFecha`, datos);
  }
















  // BUSQUEDA DE EMPLEADOS INGRESANDO NOMBRE Y APELLIDO 
  BuscarEmpleadoNombre(data: any) {
    return this.http.post(`${environment.url}/empleado/buscar/informacion`, data);
  }







  /** Verificar datos de la plantilla de datos con código generado de forma automática */
  verificarArchivoExcel_Automatico(formData) {
    return this.http.post<any>(`${environment.url}/empleado/verificar/automatico/plantillaExcel/`, formData);
  }

  verificarArchivoExcel_DatosAutomatico(formData) {
    return this.http.post<any>(`${environment.url}/empleado/verificar/datos/automatico/plantillaExcel/`, formData);
  }

  subirArchivoExcel_Automatico(formData) {
    return this.http.post<any>(`${environment.url}/empleado/cargar_automatico/plantillaExcel/`, formData);
  }

  /** Verifcar datos de la plantilla de datos con código generado de forma automática */
  verificarArchivoExcel_Manual(formData) {
    return this.http.post<any>(`${environment.url}/empleado/verificar/manual/plantillaExcel/`, formData);
  }

  verificarArchivoExcel_DatosManual(formData) {
    return this.http.post<any>(`${environment.url}/empleado/verificar/datos/manual/plantillaExcel/`, formData);
  }

  subirArchivoExcel_Manual(formData) {
    return this.http.post<any>(`${environment.url}/empleado/cargar_manual/plantillaExcel/`, formData);
  }





















  BuscarIDContrato(id: number) {
    return this.http.get(`${environment.url}/contratoEmpleado/${id}`);
  }











  BuscarFechaIdContrato(datos: any) {
    return this.http.post(`${environment.url}/contratoEmpleado/buscarFecha/contrato`, datos);
  }

  ObtenerContratos() {
    return this.http.get<any>(`${environment.url}/contratoEmpleado`);
  }








  BuscarUltimoTiposContratos() {
    return this.http.get<any>(`${environment.url}/contratoEmpleado/modalidad/trabajo/ultimo`);
  }













































  BuscarDepartamentoEmpleado(datos: any) {
    return this.http.post(`${environment.url}/empleado/buscarDepartamento`, datos);
  }
















  InsertarUbicacion(id: number, codigo: number, data: any) {
    return this.http.post<any>(`${environment.url}/empleado/geolocalizacion-domicilio/${id}/${codigo}`, data)
  }

  ActualizarUbicacionTrabajo(id: number, data: any) {
    return this.http.put<any>(`${environment.url}/empleado/geolocalizacion-trabajo/${id}`, data)
  }

  ActualizarUbicacionDomicilio(id: number, data: any) {
    return this.http.put<any>(`${environment.url}/empleado/geolocalizacion-nuevo-domicilio/${id}`, data)
  }



  ActualizarUbicacion(id: number, data: any) {
    return this.http.put<any>(`${environment.url}/empleado/actualizar-geolocalizacion/${id}`, data);
  }

}
