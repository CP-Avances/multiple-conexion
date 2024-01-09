import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class AlimentacionService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.url+localStorage.getItem('puerto');
   }

  ObtenerPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.url}/alimentacion/planificados`, datos);
  }

  ObtenerSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.url}/alimentacion/solicitados`, datos);
  }

  ObtenerExtrasPlanConsumidos(data: any) {
    return this.http.post(`${this.url}/alimentacion/extras/plan`, data)
  }

  ObtenerExtrasSolConsumidos(data: any) {
    return this.http.post(`${this.url}/alimentacion/extras/solicita`, data)
  }

  ObtenerDetallesPlanificadosConsumidos(datos: any) {
    return this.http.post(`${this.url}/alimentacion/planificados/detalle`, datos);
  }

  ObtenerDetallesSolicitadosConsumidos(datos: any) {
    return this.http.post(`${this.url}/alimentacion/solicitados/detalle`, datos);
  }

  ObtenerDetallesExtrasPlanConsumidos(data: any) {
    return this.http.post(`${this.url}/alimentacion/extras/detalle/plan`, data)
  }

  ObtenerDetallesExtrasSolConsumidos(data: any) {
    return this.http.post(`${this.url}/alimentacion/extras/detalle/solicita`, data)
  }

  ObtenerDetallesInvitados(data: any) {
    return this.http.post(`${this.url}/alimentacion/servicios/invitados`, data)
  }

  BuscarTimbresAlimentacion(data: any, inicio: string, fin: string) {
    return this.http.put<any>(`${this.url}/alimentacion/timbres-alimentacion/${inicio}/${fin}`, data);
  }

  BuscarTimbresAlimentacionRegimenCargo(data: any, inicio: string, fin: string) {
    return this.http.put<any>(`${this.url}/alimentacion/timbres-alimentacion-regimen-cargo/${inicio}/${fin}`, data);
  }

}
