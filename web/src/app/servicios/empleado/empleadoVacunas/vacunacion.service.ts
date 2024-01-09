import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacunacionService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA BUSCAR REGISTROS DE VACUNA DE UN EMPLEADO
  ObtenerVacunaEmpleado(id_empleado: number) {
    return this.http.get(`${this.url}/vacunas/${id_empleado}`);
  }

  // LISTAR TIPO DE VACUNAS
  ListarTiposVacuna() {
    return this.http.get(`${this.url}/vacunas/lista/tipo_vacuna`);
  }

  // SERVICIO REGISTROS DE VACUNACIÓN
  RegistrarVacunacion(data: any) {
    return this.http.post<any>(`${this.url}/vacunas`, data);
  }

  // METODO PARA SUBIR UN DOCUMENTO
  SubirDocumento(formData: any, id: number, nombre: string) {
    return this.http.put(`${this.url}/vacunas/${id}/documento/${nombre}`, formData)
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarVacunacion(id: number, data: any) {
    return this.http.put(`${this.url}/vacunas/${id}`, data);
  }

  // ELIMINAR CARNET DE VACUNA DEL SERVIDOR
  EliminarArchivoServidor(datos: any) {
    return this.http.put(`${this.url}/vacunas/eliminar_carnet/servidor`, datos)
  }

  // ELIMINAR CARNET DE VACUNA
  EliminarArchivo(datos: any) {
    return this.http.put(`${this.url}/vacunas/eliminar_carnet/base_servidor`, datos)
  }

  // METODO PARA ELIMINAR REGISTRO VACUNA EMPLEADO
  EliminarRegistroVacuna(id: number, documento: string) {
    return this.http.delete(`${this.url}/vacunas/eliminar/${id}/${documento}`);
  }

  // METODO DE REGISTROS DE TIPO DE VACUNACION
  CrearTipoVacuna(data: any) {
    return this.http.post<any>(`${this.url}/vacunas/tipo_vacuna`, data);
  }


}
