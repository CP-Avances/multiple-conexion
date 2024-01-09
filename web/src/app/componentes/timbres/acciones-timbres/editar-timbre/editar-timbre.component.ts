import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';
import { ParametrosService } from 'src/app/servicios/parametrosGenerales/parametros.service';

@Component({
  selector: 'app-editar-timbre',
  templateUrl: './editar-timbre.component.html',
  styleUrls: ['./editar-timbre.component.css']
})

export class EditarTimbreComponent implements OnInit {

  datosTimbre: any;
  teclaFuncionF: any;
  accionF: any;

  // LISTA DE ACCIONES DE TIMBRES
  acciones: any = [
    { value: '0', item: 'E', text: 'Entrada' },
    { value: '1', item: 'S', text: 'Salida' },
    { value: '2', item: 'I/A', text: 'Inicio alimentación' },
    { value: '3', item: 'F/A', text: 'Fin alimentación' },
    { value: '4', item: 'I/P', text: 'Inicio permiso' },
    { value: '5', item: 'F/P', text: 'Fin permiso' },
    { value: '7', item: 'HA', text: 'Timbre libre' },
    { value: '99', item: 'D', text: 'Desconocido' },
  ]

  tecl_funcio: any = [
    { value: '0' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
    { value: '7' },
    { value: '99' },
  ]

  EditartimbreForm: FormGroup;

  constructor(
    private timbreServicio: TimbresService,
    private formBuilder: FormBuilder,
    private validar: ValidacionesService,
    private toastr: ToastrService,
    public parametro: ParametrosService,
    public ventana: MatDialogRef<EditarTimbreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.LeerDatosTimbre();
  }

  /** **************************************************************************************** **
  ** **                   BUSQUEDA DE FORMATOS DE FECHAS Y HORAS                           ** ** 
  ** **************************************************************************************** **/

  formato_fecha: string = 'DD/MM/YYYY';
  formato_hora: string = 'HH:mm:ss';

  // METODO PARA BUSCAR PARAMETRO DE FORMATO DE FECHA
  BuscarParametro() {
    // id_tipo_parametro Formato fecha = 25
    this.parametro.ListarDetalleParametros(25).subscribe(
      res => {
        this.formato_fecha = res[0].descripcion;
        this.BuscarHora(this.formato_fecha)
      },
      vacio => {
        this.BuscarHora(this.formato_fecha)
      });
  }

  BuscarHora(fecha: string) {
    // id_tipo_parametro Formato hora = 26
    this.parametro.ListarDetalleParametros(26).subscribe(
      res => {
        this.formato_hora = res[0].descripcion;
        this.LeerDatosTimbre();
      },
      vacio => {
        this.LeerDatosTimbre();
      });
  }

  // METODO PARA LEER DATOS DEL TIMBRE
  LeerDatosTimbre() {
    this.datosTimbre = [];
    this.datosTimbre = this.data.timbre;
    console.log('ver timbre ', this.datosTimbre)
    this.datosTimbre.fecha = this.validar.FormatearFecha(this.datosTimbre.fec_hora_timbre_servidor, this.formato_fecha, this.validar.dia_abreviado);
    this.datosTimbre.hora = this.validar.FormatearHora(this.datosTimbre.fec_hora_timbre_servidor.split(' ')[1], this.formato_hora);

    this.EditartimbreForm = this.formBuilder.group({
      accionTimbre: [this.datosTimbre.accion, Validators.required],
      teclaFunTimbre: [this.datosTimbre.tecl_funcion, Validators.required],
      ObservacionForm: [this.datosTimbre.observacion, Validators.required]
    });
  }

  // METODO PARA SELECCIONAR ACCIONES DEL TIMBRE
  seleccion: any;
  SeleccionTecla: any;
  teclaFun: any;
  SelectedAccion(item: any) {
    this.seleccion = item.value;
    this.acciones.forEach(elementAccion => {
      if (elementAccion.item == this.seleccion) {
        this.SeleccionTecla = elementAccion.value;
      }
    });
  }

  // METODO PARA SELECCIONAR TECLA DE FUNCION
  SelectedTecla(item: any) {
    this.SeleccionTecla = item.value;
    this.acciones.forEach(elementAccion => {
      if (elementAccion.value == this.SeleccionTecla) {
        this.seleccion = elementAccion.item;
      }
    });
  }

  // METODO PARA ACTUALIZAR LOS DATOS DEL TIMBRE
  envio_accion: string = ''
  EnviarDatosTimbre(formTimbre: any) {
    let data = {
      id: this.datosTimbre.id,
      codigo: this.datosTimbre.codigo,
      accion: formTimbre.accionTimbre,
      tecla: formTimbre.teclaFunTimbre,
      observacion: formTimbre.ObservacionForm,
      fecha: this.datosTimbre.fec_hora_timbre_servidor,
    }

    console.log('data: ', data);

    this.timbreServicio.EditarTimbreEmpleado(data).subscribe(res => {
      const mensaje: any = res
      this.ventana.close(2);
      return this.toastr.success(mensaje.message, '', {
        timeOut: 4000,
      })
    }, err => {
      this.ventana.close(2);
      return this.toastr.error(err.message, '', {
        timeOut: 4000,
      })
    })
  }

}
