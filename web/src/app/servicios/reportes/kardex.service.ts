import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  url!:string;

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  /**
   * METODOS QUE OBTIENEN LA INFORMACION DEL KARDEX DE VACACIONES DIAS CALENDARIO.
   */
  ObtenerKardexVacacionDiasCalendarioByIdToken() {
    return this.http.get(`${this.url}/reportes/vacacion`);
  }
  
  ObtenerKardexVacacionDiasCalendarioByIdEmpleado(id_empleado: number, desde: string, hasta: string) {
    return this.http.get<any>(`${this.url}/reportes/vacacion/${id_empleado}/${desde}/${hasta}`);
  }

  /**
   * Metodo para traer la informacion de datos consolidados
   * @param id_empleado id del empleado que desea obtener su asistencia
   * @param desde fecha inicia el mes o cualquier inicio de fecha
   * @param hasta fecha finaliza el mes
   */
  ReporteAsistenciaDetalleConsolidado (id_empleado: number, desde: string, hasta: string) {
    return this.http.get<any>(`${this.url}/asistencia/${id_empleado}/${desde}/${hasta}`)
  }

  /**
   * Metodo para listar a los empleados con su cargo, departamento y regimen laboral
   * @param id_empresa Id de la empresa que pertenecen los empleados
   */
  ListadoEmpleadosConDepartamentoRegimen(id_empresa: number) {
    return this.http.get<any>(`${this.url}/asistencia/lista-empleados/${id_empresa}`)
  }

  ReporteHorasExtras(id_empleado: number, desde: string, hasta: string) {
    return this.http.get<any>(`${this.url}/reportes/hora-extra/${id_empleado}/${desde}/${hasta}`)
    // ${environment.url}/reportes/hora-extra/2/2020-12-01/2020-12-31
  }

}
