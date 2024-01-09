import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NivelTitulosService {

  url!:string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA LISTAR NIVEL DE TITULO PROFESIONAL
  ListarNiveles() {
    return this.http.get<any>(`${this.url}/nivel-titulo/`);
  }

  // ELIMIAR REGISTRO
  EliminarNivel(id: number) {
    return this.http.delete(`${this.url}/nivel-titulo/eliminar/${id}`);
  }

  // METODO PARA CREAR ARCHIVO XML
  CrearXML(data: any) {
    return this.http.post(`${this.url}/nivel-titulo/xmlDownload`, data);
  }

  // METODO PARA REGISTRAR NIVEL DE TITULO
  RegistrarNivel(data: any) {
    return this.http.post<any>(`${this.url}/nivel-titulo`, data);
  }

  // METODO PARA ACTUALIZAR REGISTRO DE NIVEL
  ActualizarNivelTitulo(datos: any) {
    return this.http.put(`${this.url}/nivel-titulo`, datos);
  }

  // METODO PARA BUSCAR NIVEL POR SU NOMBRE
  BuscarNivelNombre(nombre: string) {
    return this.http.get<any>(`${this.url}/nivel-titulo/buscar/${nombre}`);
  }









  // Niveles de titulos
  getOneNivelTituloRest(id: number) {
    return this.http.get<any>(`${this.url}/nivel-titulo/${id}`);
  }









}
