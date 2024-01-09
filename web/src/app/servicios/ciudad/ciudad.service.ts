import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // BUSCAR INFORMACION DE LA CIUDAD
  BuscarInformacionCiudad(id_ciudad: number) {
    return this.http.get(`${this.url}/ciudades/informacion-ciudad/${id_ciudad}`);
  }

  // BUSQUEDA DE CIUDADES
  ConsultarCiudades() {
    return this.http.get(`${this.url}/ciudades/listaCiudad`);
  }

  // BUSCAR CIUDADES POR PROVINCIA
  BuscarCiudadProvincia(id_provincia: number) {
    return this.http.get(`${this.url}/ciudades/ciudad-provincia/${id_provincia}`);
  }

  // REGISTRAR CIUDAD
  RegistrarCiudad(data: any) {
    return this.http.post(`${this.url}/ciudades`, data);
  }

  // BUSQUEDA DE NOMBRE CIUDADES - PROVINCIAS
  ListarNombreCiudadProvincia() {
    return this.http.get(`${this.url}/ciudades`);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarCiudad(id: number) {
    return this.http.delete(`${this.url}/ciudades/eliminar/${id}`);
  }

   // METODO PARA CREAR ARCHIVO XML
   CrearXML(data: any) {
    return this.http.post(`${this.url}/ciudades/xmlDownload`, data);
  }

  // METODO PARA BUSCAR INFORMACION DE UNA CIUDAD
  BuscarUnaCiudad(id: number) {
    return this.http.get(`${this.url}/ciudades/${id}`);
  }

}
