import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {

  url!:string;

  constructor(
    private http: HttpClient,
  ) { 
    this.url = environment.url+localStorage.getItem('puerto');
  }

  // METODO PARA VER MENSAJE DE CUMPLEAÑOS
  VerMensajeCumpleanios(id_empresa: number) {
    return this.http.get(`${this.url}/birthday/${id_empresa}`);
  }

  // METODO PARA REGISTRAR MENSAJE
  CrearMensajeCumpleanios(data: any) {
    return this.http.post(`${this.url}/birthday`, data);
  }

  // METODO PARA CARGAR IMAGEN DE CUMPLEAÑOS
  SubirImagenBirthday(formData: any, id_empresa: number) {
    return this.http.put(`${this.url}/birthday/${id_empresa}/uploadImage`, formData)
  }

  // METODO PARA ACTUALIZAR MENSAJE DE CUMPLEAÑOS
  EditarMensajeCumpleanios(id_birthday: number, data: any) {
    return this.http.put(`${this.url}/birthday/editar/${id_birthday}`, data)
  }

}
