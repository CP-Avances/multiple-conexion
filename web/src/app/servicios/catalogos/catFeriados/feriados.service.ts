import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA BUSCAR LISTA DE FERIADOS
  ConsultarFeriado() {
    return this.http.get(`${this.url}/feriados`);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarFeriado(id: number) {
    return this.http.delete(`${this.url}/feriados/delete/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/feriados/xmlDownload`, data);
  }

  // METODO PARA CREAR NUEVO REGISTRO DE FERIADO
  CrearNuevoFeriado(datos: any) {
    return this.http.post<any>(`${this.url}/feriados`, datos)
      .pipe(
        catchError(datos)
      );
  }

  // METODO PARA BUSCAR FERIADOS EXCEPTO REGISTRO EDITADO
  ConsultarFeriadoActualiza(id: number) {
    return this.http.get(`${this.url}/feriados/listar/${id}`);
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarUnFeriado(datos: any) {
    return this.http.put(`${this.url}/feriados`, datos).pipe(
      catchError(datos));
  }

  // METODO PARA BUSCAR INFORMACION DE UN FERIADO ESPECIFICO
  ConsultarUnFeriado(id: number) {
    return this.http.get(`${this.url}/feriados/${id}`);
  }

  // METODO PARA LISTAR FERIADOS SEGUN CIUDAD Y RANGO DE FECHAS   --**VERIFICADO
  ListarFeriadosCiudad(datos: any) {
    return this.http.post<any>(`${this.url}/feriados/listar-feriados/ciudad`, datos);
  }

  // METODO PARA LISTAR FECHAS DE RECUPERACION DE FERIADOS SEGUN CIUDAD Y RANGO DE FECHAS  --**VERIFICADO
  ListarFeriadosRecuperarCiudad(datos: any) {
    return this.http.post<any>(`${this.url}/feriados/listar-feriados-recuperar/ciudad`, datos);
  }


  subirArchivoExcel(formData) {
    return this.http.post<any>(this.url + '/feriados/upload', formData);
  }

  RevisarFormato(formData) {
    return this.http.post<any>(this.url + '/feriados/upload/revision', formData);
  }

  RevisarDuplicidad(formData) {
    return this.http.post<any>(this.url + '/feriados/upload/revision_data', formData);
  }




}
