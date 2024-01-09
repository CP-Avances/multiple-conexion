// IMPORTAR LIBRERIAS
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

// IMPORTAR SERVICIOS
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';

@Component({
  selector: 'app-registro-horario',
  templateUrl: './registro-horario.component.html',
  styleUrls: ['./registro-horario.component.css'],
})

export class RegistroHorarioComponent implements OnInit {

  // VARIABLES DE OPCIONES DE REGISTRO DE HORARIO
  detalle = false;
  nocturno = false;
  isChecked: boolean = false;

  // VALIDACIONES PARA EL FORMULARIO
  horaTrabajo = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(:[0-9][0-9])?$")]);
  minAlmuerzo = new FormControl(0, Validators.pattern('[0-9]*'));
  archivoForm = new FormControl('');
  documentoF = new FormControl('');
  codigoF = new FormControl('', [Validators.required]);
  nombre = new FormControl('', [Validators.required, Validators.minLength(2)]);
  tipoF = new FormControl('');

  // ASIGNAR LOS CAMPOS EN UN FORMULARIO EN GRUPO
  public formulario = new FormGroup({
    horarioHoraTrabajoForm: this.horaTrabajo,
    horarioMinAlmuerzoForm: this.minAlmuerzo,
    documentoForm: this.documentoF,
    nombreForm: this.nombre,
    codigoForm: this.codigoF,
    tipoForm: this.tipoF,
  });


  // VARIABLES PROGRESS SPINNER
  habilitarprogress: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  color: ThemePalette = 'primary';
  value = 10;

  constructor(
    public ventana: MatDialogRef<RegistroHorarioComponent>, // VARIABLE MANEJO DE VENTANAS
    public validar: ValidacionesService, // SERVICIO PARA CONTROL DE VALIDACIONES
    public router: Router, // VARIABLE MANEJO DE RUTAS
    private rest: HorarioService, // SERVICIO DATOS DE HORARIO
    private toastr: ToastrService, // VARIABLE PARA USO DE NOTIFICACIONES
  ) { }

  ngOnInit(): void {
  }

  // VARAIBLE DE ALMACENAMIENTO DE DATOS DE AUDITORIA
  data_nueva: any = [];

  // METODO PARA TOMAR LOS DATOS DE HORARIO
  idHorario: any;
  InsertarHorario(form: any) {
    this.habilitarprogress = true;
    let dataHorario = {
      min_almuerzo: form.horarioMinAlmuerzoForm,
      hora_trabajo: form.horarioHoraTrabajoForm,
      nocturno: form.tipoForm,
      detalle: true,
      nombre: form.nombreForm,
      codigo: form.codigoForm,
    };

    // FORMATEAR HORAS
    if (dataHorario.hora_trabajo.split(':').length === 1) {
      if (parseInt(dataHorario.hora_trabajo) < 10) {
        dataHorario.hora_trabajo = '0' + parseInt(dataHorario.hora_trabajo) + ':00'
      }
      else {
        dataHorario.hora_trabajo = dataHorario.hora_trabajo + ':00'
      }
    }
    else {
      if (parseInt(dataHorario.hora_trabajo.split(':')[0]) < 10) {
        dataHorario.hora_trabajo = '0' + parseInt(dataHorario.hora_trabajo.split(':')[0]) + ':' + dataHorario.hora_trabajo.split(':')[1]
      }
    }

    // VALIDAR SI EL HORARIO ES >= 24:00 Y < 72:00 (NO DETALLES DE ALIMENTACION)
    if ((dataHorario.hora_trabajo >= '24:00' && dataHorario.hora_trabajo < '72:00') &&
      (dataHorario.hora_trabajo >= '24:00:00' && dataHorario.hora_trabajo < '72:00:00')) {
      this.minAlmuerzo.setValue(0);
      dataHorario.min_almuerzo = 0;
    }
    else if (dataHorario.hora_trabajo >= '72:00' || dataHorario.hora_trabajo >= '72:00:00') {
      dataHorario.hora_trabajo = moment(dataHorario.hora_trabajo, 'HH:mm:ss').format('HH:mm:ss');
    }

    // VERIFICAR INGRESO DE MINUTOS DE ALIMENTACION
    if (dataHorario.min_almuerzo === '' || dataHorario.min_almuerzo === null || dataHorario.min_almuerzo === undefined) {
      dataHorario.min_almuerzo = 0;
    }

    // VALIDACION DE DUPLICIDAD
    this.VerificarDuplicidad(form, dataHorario);

  }

  // VERIFICAR DUPLICIDAD DE NOMBRES Y CODIGOS
  VerificarDuplicidad(form: any, horario: any) {
    let data = {
      codigo: form.codigoForm
    }
    this.rest.BuscarHorarioNombre(data).subscribe(response => {
      this.toastr.warning('Código de horario ya existe.', 'Verificar datos.', {
        timeOut: 6000,
      });
      this.habilitarprogress = false;

    }, error => {
      this.VerificarArchivo(horario, form);
    });
  }

  // VERIFICAR QUE SE CARGO ARCHIVO
  VerificarArchivo(datos: any, form: any) {
    if (this.isChecked === true) {
      if (form.documentoForm != '') {
        this.GuardarDatos(datos, form);
      }
      else {
        this.toastr.warning('Cargar documento como respaldo de creación de horario.', '', {
          timeOut: 6000,
        });
        this.habilitarprogress = false;
      }
    }
    else {
      this.GuardarDatos(datos, form);
    }
  }


  // METODO PARA REGISTRAR DATOS DEL HORARIO
  GuardarDatos(datos: any, form: any) {
    this.rest.RegistrarHorario(datos).subscribe(response => {
      this.RegistrarAuditoria(datos);
      this.toastr.success('Operación exitosa.', 'Registro guardado.', {
        timeOut: 6000,
      });

      if (this.isChecked === true && form.documentoForm != '') {
        this.SubirRespaldo(response.id, response.codigo);
      }

      this.LimpiarCampos();

      if (datos.detalle === true) {
        this.ventana.close(response.id);
      }
      else {
        this.ventana.close(0);
      }

    }, error => {
      this.habilitarprogress = false;
      this.toastr.error('Limite de horas superado.', 'Ups!!! algo salio mal.', {
        timeOut: 6000,
      })
    });
  }

  /** ********************************************************************************************* **
   ** **                             METODO PARA SUBIR ARCHIVO                                   ** **
   ** ********************************************************************************************* **/

  // METODO PARA SELECCIONAR ARCHIVO
  archivoSubido: Array<File>;
  nameFile: string;
  fileChange(element: any) {
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      if (this.archivoSubido[0].size <= 2e+6) {
        this.formulario.patchValue({ documentoForm: name });
        this.HabilitarBtn = true;
      }
      else {
        this.toastr.info('El archivo ha excedido el tamaño permitido.', 'Tamaño de archivos permitido máximo 2MB.', {
          timeOut: 6000,
        });
      }
    }
  }

  // METODO PARA REGISTRAR RESPALDO DE CREACION DE HORARIO
  SubirRespaldo(id: number, codigo: any) {
    this.habilitarprogress = true;
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.SubirArchivo(formData, id, null, codigo).subscribe(res => {
      this.habilitarprogress = false;
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  // METODO PARA LIMPIAR CAMPO NOMBRE DE ARCHIVO
  LimpiarNombreArchivo() {
    this.formulario.patchValue({
      documentoForm: '',
    });
  }

  // METODO PARA HABILITAR VISTA DE SELECCIÓN DE ARCHIVO
  HabilitarBtn: boolean = false;
  RetirarArchivo() {
    this.isChecked = false;
    this.archivoSubido = [];
    this.HabilitarBtn = false;
    this.LimpiarNombreArchivo();
    this.archivoForm.patchValue('');
  }

  // METODO PARA VALIDAR INGRESO DE HORAS
  IngresarNumeroCaracter(evt: any) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // COMPROBAMOS SI SE ENCUENTRA EN EL RANGO NUMERICO Y QUE TECLAS NO RECIBIRA.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 58) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  // METODO PARA VALIDAR INGRESO DE NUMEROS
  IngresarSoloNumerosEnteros(evt: any) {
    return this.validar.IngresarSoloNumeros(evt);
  }

  // MENSAJE QUE INDICA FORMATO DE INGRESO DE NUMERO DE HORAS
  ObtenerMensajeErrorHoraTrabajo() {
    if (this.horaTrabajo.hasError('pattern')) {
      return 'Indicar horas y minutos. Ejemplo: 12:05';
    }
  }

  // METODO PARA LIMPIAR FORMULARIOS
  LimpiarCampos() {
    this.formulario.reset();
    this.habilitarprogress = false;
  }

  // METODO PARA CERRAR VENTANA
  CerrarVentana() {
    this.LimpiarCampos();
    this.ventana.close('cv');
  }

  // METODO PARA AUDITAR CATÁLOGO HORARIOS
  RegistrarAuditoria(dataHorario: any) {
    this.data_nueva = [];
    this.data_nueva = dataHorario;
    this.validar.Auditar('app-web', 'cg_horarios', '', this.data_nueva, 'INSERT');
  }

  // METODO PARA VER FORMULARIO DE ARCHIVO
  ActivarArchivo(ob: MatCheckboxChange) {
    if (ob.checked === true) {
      this.isChecked = true;
    }
    else {
      this.isChecked = false;
    }
  }

}
