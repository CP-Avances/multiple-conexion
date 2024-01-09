import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TipoPermisosService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA BUSCAR TIPOS DE PERMISOS
  BuscarTipoPermiso() {
    return this.http.get(`${this.url}/tipoPermisos`);
  }

  // ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/tipoPermisos/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/tipoPermisos/xmlDownload`, data);
  }

  // METODO PARA LISTAR DATOS DE UN TIPO DE PERMISO
  BuscarUnTipoPermiso(id: number) {
    return this.http.get(`${this.url}/tipoPermisos/${id}`);
  }

  // METODO PARA REGISTRAR TIPO PERMISO
  RegistrarTipoPermiso(data: any) {
    return this.http.post(`${this.url}/tipoPermisos`, data).pipe(
      catchError(data));
  }

  // ACTUALIZAR REGISTRO TIPO PERMISO
  ActualizarTipoPermiso(id: number, data: any) {
    return this.http.put(`${this.url}/tipoPermisos/editar/${id}`, data);
  }


  // LISTAR PERMISOS DE ACUERDO AL ROL
  ListarTipoPermisoRol(access: number) {
    return this.http.get(`${this.url}/tipoPermisos ${access}`);
  }

}
