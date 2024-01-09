import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class EmpleadoHorariosService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }


  // METODO PARA BUSCAR HORARIO DEL USUARIO
  BuscarHorarioUsuario(codigo: any) {
    return this.http.get(`${this.url}/empleadoHorario/horarioCodigo/${codigo}`);
  }

  // METODO PARA REGISTRAR HORARIO DE USUARIO
  IngresarEmpleadoHorarios(datos: any) {
    return this.http.post(`${this.url}/empleadoHorario`, datos);
  }

  // METODO PARA VERIFICAR HORARIOS DUPLICADOS  --**VERIFICADO
  VerificarDuplicidadHorarios(codigo: string, datos: any) {
    return this.http.post(`${this.url}/empleadoHorario/validarFechas/${codigo}`, datos);
  }

  // METODO PARA BUSCAR HORARIOS DE EMPLEADO EN UN RANGO DE FECHAS  --**VERIFICADO
  VerificarHorariosExistentes(codigo: string, datos: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/horarios-existentes/${codigo}`, datos);
  }

  // METODO PARA VERIFICAR HORARIOS DUPLICADOS ACTUALIZACION
  VerificarDuplicidadHorariosEdicion(id: number, codigo: number, datos: any) {
    return this.http.post(`${this.url}/empleadoHorario/validarFechas/horarioEmpleado/${id}/empleado/${codigo}`, datos);
  }

  // METODO PARA BUSCAR HORARIOS DE EMPLEADO EN UN RANGO DE FECHAS ACTUALIZACION
  VerificarHorariosExistentesEdicion(id_empl: number, datos: any) {
    return this.http.post(`${this.url}/empleadoHorario/horarios-existentes-edicion/${id_empl}`, datos);
  }

  // METODO PARA BUSCAR HORARIO DEL USUARIO POR HORAS MISMO DIA (MD)
  BuscarHorarioHorasMD(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/horario-horas-mismo-dia`, datos);
  }

  // METODO PARA BUSCAR HORARIO DEL USUARIO POR HORAS DIAS DIFERENTES (DD)
  BuscarHorarioHorasDD(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/horario-horas-dias-diferentes`, datos);
  }

  // METODO PARA BUSCAR HORARIO DEL USUARIO POR HORAS MISMO DIA (MD)
  BuscarComidaHorarioHorasMD(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/horario-comida-horas-mismo-dia`, datos);
  }

  // METODO PARA BUSCAR HORARIO DEL USUARIO POR HORAS DIAS DIFERENTES (DD)
  BuscarComidaHorarioHorasDD(datos: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/horario-comida-horas-dias-diferentes`, datos);
  }





















  //Horarios Empleado

  ConsultarEmpleadoHorarios() {
    return this.http.get(`${this.url}/empleadoHorario`);
  }




  CargaMultiple(formData) {
    return this.http.post(`${this.url}/empleadoHorario/cargaMultiple`, formData)
  }


  ActualizarDatos(datos: any) {
    return this.http.put(`${this.url}/empleadoHorario`, datos);
  }

  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/empleadoHorario/eliminar/${id}`);
  }

  ObtenerHorariosFechasEmpleado(codigo: string | number, data: any) {
    return this.http.post(`${this.url}/empleadoHorario/fechas_horario/${codigo}`, data)
  }






  // Verificar datos de la plantilla de horario fijo
  VerificarDatos_EmpleadoHorario(formData: any, id: number) {
    console.log('entra')
    return this.http.post<any>(`${this.url}/empleadoHorario/revisarData/${id}`, formData)
  }
  VerificarPlantilla_EmpleadoHorario(formData: any) {
    return this.http.post<any>(`${this.url}/empleadoHorario/verificarPlantilla/upload`, formData)
  }
  CreaPlanificacion(formData: any, id: number, codigo: string | number) {
    return this.http.post<any>(`${this.url}/empleadoHorario/plan_general/upload/${id}/${codigo}`, formData)
  }
  SubirArchivoExcel(formData: any, id: number, codigo: string | number) {
    return this.http.post<any>(`${this.url}/empleadoHorario/upload/${id}/${codigo}`, formData)
  }

  BuscarHorarioFechas(codigo: any, datos: any) {
    return this.http.post(`${this.url}/empleadoHorario/busqueda-horarios/${codigo}`, datos);
  }
}
