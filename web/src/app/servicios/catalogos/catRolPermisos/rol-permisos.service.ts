import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RolPermisosService {

  url!:string;

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  // catalogo de ROL PERMISOS

  getRolPermisoRest() {
    return this.http.get(`${this.url}/rolPermisos`);
  }

  getOneRolPermisoRest(id: number) {
    return this.http.get(`${this.url}/rolPermisos/${id}`);
  }

  postRolPermisoRest(data: any) {
    return this.http.post(`${this.url}/rolPermisos`, data);
  }

  // permisos denegado

  getPermisosUsuarioRolRest(id: number) {
    return this.http.get(`${this.url}/rolPermisos/denegado/${id}`);
  }

  postPermisoDenegadoRest(data: any) {
    return this.http.post(`${this.url}/rolPermisos/denegado`, data);
  }

}
