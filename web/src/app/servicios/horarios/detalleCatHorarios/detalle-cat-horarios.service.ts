import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DetalleCatHorariosService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA BUSCAR DETALLES DE UN HORARIO    --**VERIFICADO
  ConsultarUnDetalleHorario(id: number) {
    return this.http.get<any>(`${this.url}/detalleHorario/${id}`);
  }

  // METODO PARA ELIMINAR REGISTRO  
  EliminarRegistro(id: number) {
    return this.http.delete(`${this.url}/detalleHorario/eliminar/${id}`);
  }

  // METODO PARA REGISTRAR DETALLE DE HORARIO
  IngresarDetalleHorarios(datos: any) {
    return this.http.post(`${this.url}/detalleHorario`, datos);
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarRegistro(data: any) {
    return this.http.put(`${this.url}/detalleHorario`, data);
  }






  // VERIFICAR DATOS DE LA PLANTILLA DE DETALLES DE HORRAIO Y CARGARLOS AL SISTEMA
  CargarPlantillaDetalles(formData) {
    return this.http.post<any>(this.url + '/detalleHorario/upload', formData)
  }

  VerificarDatosDetalles(formData) {
    return this.http.post<any>(this.url + '/detalleHorario/verificarDatos/upload', formData)
  }
}
