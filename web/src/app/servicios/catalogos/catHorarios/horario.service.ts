import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // REGISTRAR HORARIO
  RegistrarHorario(data: any) {
    return this.http.post<any>(`${this.url}/horario`, data);
  }

  // BUSCAR HORARIO POR EL NOMBRE
  BuscarHorarioNombre(datos: any) {
    return this.http.post(`${this.url}/horario/buscar-horario/nombre`, datos);
  }

  // CARGAR ARCHIVO DE RESPALDO   --**VERIFICADO
  SubirArchivo(formData: any, id: number, archivo: any, codigo: any) {
    return this.http.put(`${this.url}/horario/${id}/documento/${archivo}/verificar/${codigo}`, formData)
  }

  // ACTUALIZACION DE HORARIO
  ActualizarHorario(id: number, data: any) {
    return this.http.put(`${this.url}/horario/editar/${id}`, data);
  }

  // ELIMINAR DOCUMENTO DE CONTRATO
  EliminarArchivo(datos: any) {
    return this.http.put(`${this.url}/horario/eliminar_horario/base_servidor`, datos)
  }

  // ELIMINAR DOCUMENTO DE CONTRATO DEL SERVIDOR
  EliminarArchivoServidor(datos: any) {
    return this.http.put(`${this.url}/horario/eliminar_horario/servidor`, datos)
  }

  // BUSCAR LISTA DE CATALOGO DE HORARIOS         --** VERIFICADO
  BuscarListaHorarios() {
    return this.http.get(`${this.url}/horario`);
  }

  // BUSCAR HORARIOS SIN CONSIDERAR UN HORARIO EN ESPECIFICO
  BuscarHorarioNombre_(datos: any) {
    return this.http.post<any>(`${this.url}/horario/buscar_horario/edicion`, datos);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/horario/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/horario/xmlDownload`, data);
  }

  // BUSCAR DATOS DE UN HORARIO
  BuscarUnHorario(id: number) {
    return this.http.get(`${this.url}/horario/${id}`);
  }

  // METODO PARA ACTUALIZAR HORAS DE TRABAJO
  ActualizarHorasTrabaja(id: number, data: any) {
    return this.http.put(`${this.url}/horario/update-horas-trabaja/${id}`, data);
  }











  // VERIFICAR DATOS DE LA PLANTILLA DE CATÁLOGO HORARIO Y CARGAR AL SISTEMA
  VerificarDatosHorario(formData) {
    return this.http.post<any>(`${this.url}/horario/cargarHorario/verificarDatos/upload`, formData);
  }
  VerificarPlantillaHorario(formData) {
    return this.http.post<any>(`${this.url}/horario/cargarHorario/verificarPlantilla/upload`, formData);
  }
  CargarHorariosMultiples(formData) {
    return this.http.post<any>(`${this.url}/horario/cargarHorario/upload`, formData);
  }

}
