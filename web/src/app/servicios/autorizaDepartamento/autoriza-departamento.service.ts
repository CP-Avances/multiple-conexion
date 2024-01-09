import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class AutorizaDepartamentoService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }


  // METODO PARA BUSCAR USUARIO AUTORIZA
  BuscarAutoridadEmpleado(id: any) {
    return this.http.get(`${this.url}/autorizaDepartamento/autoriza/${id}`);
  }

  // METODO PARA BUSCAR USUARIO AUTORIZA
  BuscarAutoridadUsuarioDepa(id: any) {
    return this.http.get(`${this.url}/autorizaDepartamento/autorizaUsuarioDepa/${id}`);
  }

  // METODO PARA REGISTRAR AUTORIZACION
  IngresarAutorizaDepartamento(datos: any) {
    return this.http.post(`${this.url}/autorizaDepartamento`, datos);
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarDatos(datos: any) {
    return this.http.put(`${this.url}/autorizaDepartamento/actualizar`, datos);
  }

  // METODO PARA ELIMINAR REGISTRO
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/autorizaDepartamento/eliminar/${id}`);
  }












  //Empleado que autoriza en un departamento

  ConsultarAutorizaDepartamento() {
    return this.http.get(`${this.url}/autorizaDepartamento`);
  }


  BuscarEmpleadosAutorizan(id: any) {
    return this.http.get(`${this.url}/autorizaDepartamento/empleadosAutorizan/${id}`);
  }


  // METODO PARA LISTAR USUARIOS QUE APRUEBAN EN UN DEPARTAMENTO    --**VERIFICADO
  BuscarListaEmpleadosAutorizan(id: any) {
    return this.http.get(`${this.url}/autorizaDepartamento/listaempleadosAutorizan/${id}`);
  }

  BuscarListaAutorizaDepa(id_depar: any) {
    return this.http.get(`${this.url}/autorizaDepartamento/listaDepaAutoriza/${id_depar}`);
  }


}
