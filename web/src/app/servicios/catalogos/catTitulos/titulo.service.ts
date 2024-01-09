import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }


  // METODO PARA LISTAR TITULOS
  ListarTitulos() {
    return this.http.get(`${this.url}/titulo/`);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/titulo/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/titulo/xmlDownload`, data);
  }

  // METODO PARA REGISTRAR TITULO
  RegistrarTitulo(data: any) {
    return this.http.post(`${this.url}/titulo`, data);
  }

  // METODO PARA ACTUALIZAR REGISTRO DE TITULO
  ActualizarUnTitulo(datos: any) {
    return this.http.put(`${this.url}/titulo`, datos);
  }











  // Catálogo de títulos

  getOneTituloRest(id: number) {
    return this.http.get(`${this.url}/titulo/${id}`);
  }








}
