import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { ParametrosService } from 'src/app/servicios/parametrosGenerales/parametros.service';

@Component({
  selector: 'app-solicita-comida',
  templateUrl: './solicita-comida.component.html',
  styleUrls: ['./solicita-comida.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})

export class SolicitaComidaComponent implements OnInit {

  // DATOS DEL EMPLEADO QUE INICIA SESION
  idEmpleadoIngresa: number;
  nota = 'un servicio';
  user = '';

  fechaPlanificacionF = new FormControl('', Validators.required);
  observacionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  idEmpleadoF = new FormControl('');
  horaInicioF = new FormControl('', Validators.required);
  idComidaF = new FormControl('', Validators.required);
  horaFinF = new FormControl('', Validators.required);
  platosF = new FormControl('', Validators.required);;
  fechaF = new FormControl('', [Validators.required]);
  extraF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', Validators.required);;

  // ASIGNAR LOS CAMPOS EN UN FORMULARIO EN GRUPO
  public PlanificacionComidasForm = new FormGroup({
    fechaPlanificacionForm: this.fechaPlanificacionF,
    observacionForm: this.observacionF,
    horaInicioForm: this.horaInicioF,
    idComidaForm: this.idComidaF,
    horaFinForm: this.horaFinF,
    platosForm: this.platosF,
    fechaForm: this.fechaF,
    extraForm: this.extraF,
    tipoForm: this.tipoF,
  });

  tipoComidas: any = [];
  empleados: any = [];

  departamento: any;
  FechaActual: any;

  constructor(
    private informacion: DatosGeneralesService,
    private toastr: ToastrService,
    private aviso: RealTimeService,
    private rest: TipoComidasService,
    public restE: EmpleadoService,
    public validar: ValidacionesService,
    public ventana: MatDialogRef<SolicitaComidaComponent>,
    public restPlan: PlanComidasService,
    public restUsuario: UsuarioService,
    public parametro: ParametrosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idEmpleadoIngresa = parseInt(localStorage.getItem('empleado') as string);
    this.departamento = parseInt(localStorage.getItem("departamento") as string);
  }

  ngOnInit(): void {
    console.log('datos', this.data, 'departamento', this.departamento)
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    this.obtenerInformacionEmpleado();
    this.ObtenerEmpleados(this.data.idEmpleado);
    this.ObtenerServicios();
    this.BuscarParametro();
    this.BuscarHora();
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
      });
  }

  BuscarHora() {
    // id_tipo_parametro Formato hora = 26
    this.parametro.ListarDetalleParametros(26).subscribe(
      res => {
        this.formato_hora = res[0].descripcion;
      });
  }

  // METODO PARA OBTENER CONFIGURACION DE NOTIFICACIONES
  solInfo: any;
  obtenerInformacionEmpleado() {
    var estado: boolean;
    this.informacion.ObtenerInfoConfiguracion(this.data.idEmpleado).subscribe(
      res => {
        if (res.estado === 1) {
          estado = true;
        }
        this.solInfo = [];
        this.solInfo = {
          comida_mail: res.comida_mail,
          comida_noti: res.comida_noti,
          empleado: res.id_empleado,
          id_dep: res.id_departamento,
          id_suc: res.id_sucursal,
          estado: estado,
          correo: res.correo,
          fullname: res.fullname,
        }
        if (this.data.idEmpleado != this.idEmpleadoIngresa) {
          this.nota = 'el servicio';
          this.user = 'para ' + this.solInfo.fullname;
        }
      })
  }

  // METODO PARA OBTENER LISTA DE SERVICIOS DE ALIMENTACION
  servicios: any = [];
  ObtenerServicios() {
    this.servicios = [];
    this.restPlan.ObtenerTipoComidas().subscribe(datos => {
      this.servicios = datos;
    })
  }

  // AL SELECCIONAR UN TIPO DE SERVICIO SE MUESTRA LA LISTA DE MENÚS REGISTRADOS
  ObtenerPlatosComidas(form: any) {
    this.idComidaF.reset();
    this.platosF.reset();
    this.horaInicioF.reset();
    this.horaFinF.reset();
    this.tipoComidas = [];
    this.rest.ConsultarUnServicio(form.tipoForm).subscribe(datos => {
      this.tipoComidas = datos;
    }, error => {
      this.toastr.info('Verificar la información.', 'No existen registrados Menús para esta tipo de servicio.', {
        timeOut: 6000,
      })
    })
  }

  // METODO DE BUSQUEDA DE DETALLES DE ALIMENTACION
  detalle: any = [];
  ObtenerDetalleMenu(form: any) {
    this.platosF.reset();
    this.horaInicioF.reset();
    this.horaFinF.reset();
    this.detalle = [];
    this.rest.ConsultarUnDetalleMenu(form.idComidaForm).subscribe(datos => {
      this.detalle = datos;
      this.PlanificacionComidasForm.patchValue({
        horaInicioForm: this.detalle[0].hora_inicio,
        horaFinForm: this.detalle[0].hora_fin
      })
    }, error => {
      this.toastr.info('Verificar la información.', 'No existen registros de Alimentación para este Menú.', {
        timeOut: 6000,
      })
    })
  }

  // METODO PARA VER LA INFORMACION DEL EMPLEADO 
  ObtenerEmpleados(idemploy: any) {
    this.empleados = [];
    this.restE.BuscarUnEmpleado(idemploy).subscribe(data => {
      this.empleados = data;
      this.PlanificacionComidasForm.patchValue({
        fechaForm: this.FechaActual,
        extraForm: 'false'
      })
    })
  }

  // METODO PARA REGISTRAR SOLICITUD DE ALIMENTACION
  contador: number = 0;
  InsertarPlanificacion(form: any) {
    // DATOS DE PLANIFICACION
    let datosPlanComida = {
      id_departamento: this.solInfo.id_dep,
      id_empleado: this.data.idEmpleado,
      observacion: form.observacionForm,
      hora_inicio: form.horaInicioForm,
      fec_comida: form.fechaPlanificacionForm,
      id_comida: form.platosForm,
      verificar: 'NO',
      hora_fin: form.horaFinForm,
      fecha: form.fechaForm,
      extra: form.extraForm,
    };
    // VERIFICAR SI EXISTE UNA SOLICITUD O PLANIFICACION REGISTRADA
    let datosDuplicados = {
      id: this.data.idEmpleado,
      fecha_fin: form.fechaPlanificacionForm,
      fecha_inicio: form.fechaPlanificacionForm,
    }
    // METODO PARA BUSCAR DATOS DUPLICADOS
    this.restPlan.BuscarDuplicadosFechas(datosDuplicados).subscribe(plan => {
      this.toastr.info(this.empleados[0].nombre + ' ' + this.empleados[0].apellido + ' ya tiene registrada una planificación de alimentación en la fecha solicitada.', '', {
        timeOut: 6000,
      })
    }, error => {
      // METODO PARA CREAR SOLICITUD DE ALIMENTACION
      this.restPlan.CrearSolicitudComida(datosPlanComida).subscribe(alimentacion => {
        alimentacion.EmpleadosSendNotiEmail.push(this.solInfo);
        this.EnviarCorreo(alimentacion);
        this.NotificarPlanificacion(alimentacion);
        this.toastr.success('Operación exitosa.', 'Solicitud registrada.', {
          timeOut: 6000,
        });
        this.CerrarRegistroPlanificacion();
      });
    });
  }

  // METODO PARA ENVIO DE NOTIFICACION
  NotificarPlanificacion(alimentacion: any) {

    console.log('enviar planificacion ', alimentacion)

    // METODO PARA OBTENER NOMBRE DEL DÍA EN EL CUAL SE REALIZA LA SOLICITUD DE ALIMENTACIÓN
    let desde = this.validar.FormatearFecha(alimentacion.fec_comida, this.formato_fecha, this.validar.dia_completo);

    let inicio = this.validar.FormatearHora(alimentacion.hora_inicio, this.formato_hora);
    let final = this.validar.FormatearHora(alimentacion.hora_fin, this.formato_hora);

    let mensaje = {
      id_empl_envia: this.idEmpleadoIngresa,
      id_empl_recive: '',
      tipo: 1, // SOLICITUD SERVICIO DE ALIMENTACIÓN
      mensaje: 'Ha solicitado ' + this.nota + ' de alimentación ' + this.user + ' desde ' +
        desde +
        ' horario de ' + inicio + ' a ' + final + ' servicio ',
      id_comida: alimentacion.id_comida
    }

    alimentacion.EmpleadosSendNotiEmail.forEach(e => {
      mensaje.id_empl_recive = e.empleado;
      if (e.comida_noti) {
        this.restPlan.EnviarMensajePlanComida(mensaje).subscribe(res => {
          console.log('data de la notificacion .... ', res.respuesta);
          this.aviso.RecibirNuevosAvisos(res.respuesta);
        })
      }
    })

  }

  // METODO PARA ENVIO DE CORREO
  EnviarCorreo(alimentacion: any) {
    var cont = 0;
    var correo_usuarios = '';

    // METODO PARA OBTENER NOMBRE DEL DÍA EN EL CUAL SE REALIZA LA SOLICITUD DE ALIMENTACIÓN
    let solicitud = this.validar.FormatearFecha(alimentacion.fec_comida, this.formato_fecha, this.validar.dia_completo);

    alimentacion.EmpleadosSendNotiEmail.forEach(e => {

      // LECTURA DE DATOS LEIDOS
      cont = cont + 1;

      // SI EL USUARIO SE ENCUENTRA ACTIVO Y TIENEN CONFIGURACIÓN RECIBIRA CORREO DE SOLICITUD DE ALIMENTACIÓN
      if (e.comida_mail) {
        if (e.estado === true) {
          if (correo_usuarios === '') {
            correo_usuarios = e.correo;
          }
          else {
            correo_usuarios = correo_usuarios + ', ' + e.correo
          }
        }
      }

      if (cont === alimentacion.EmpleadosSendNotiEmail.length) {
        let comida = {
          id_usua_solicita: alimentacion.id_empleado,
          tipo_solicitud: 'Servicio de alimentación solicitado por',
          fec_solicitud: solicitud,
          observacion: alimentacion.observacion,
          id_comida: alimentacion.id_comida,
          proceso: 'creado',
          correo: correo_usuarios,
          estadoc: 'Pendiente de autorización',
          asunto: 'SOLICITUD DE SERVICIO DE ALIMENTACION',
          inicio: this.validar.FormatearHora(alimentacion.hora_inicio, this.formato_hora),
          final: this.validar.FormatearHora(alimentacion.hora_fin, this.formato_hora),
          extra: alimentacion.extra,
          id: alimentacion.id,
          solicitado_por: localStorage.getItem('fullname_print'),
        }
        if (correo_usuarios != '') {
          this.restPlan.EnviarCorreo(comida).subscribe(
            resp => {
              if (resp.message === 'ok') {
                this.toastr.success('Correo de solicitud enviado exitosamente.', '', {
                  timeOut: 6000,
                });
              }
              else {
                this.toastr.warning('Ups algo salio mal !!!', 'No fue posible enviar correo de solicitud.', {
                  timeOut: 6000,
                });
              }
            },
            err => {
              this.toastr.error(err.error.message, '', {
                timeOut: 6000,
              });
            },
            () => { },
          )
        }
      }
    })
  }


  IngresarSoloLetras(e) {
    this.validar.IngresarSoloLetras(e);
  }

  ObtenerMensajeErrorObservacion() {
    if (this.observacionF.hasError('pattern')) {
      return 'Ingrese información válida';
    }
    return this.observacionF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  CerrarRegistroPlanificacion() {
    this.LimpiarCampos();
    this.ventana.close();
  }

  LimpiarCampos() {
    this.PlanificacionComidasForm.reset();
    this.ObtenerServicios();
  }

}
