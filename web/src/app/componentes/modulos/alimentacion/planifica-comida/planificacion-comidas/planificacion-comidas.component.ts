import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { ParametrosService } from 'src/app/servicios/parametrosGenerales/parametros.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

import { PlanComidasComponent } from '../plan-comidas/plan-comidas.component';

@Component({
  selector: 'app-planificacion-comidas',
  templateUrl: './planificacion-comidas.component.html',
  styleUrls: ['./planificacion-comidas.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})

export class PlanificacionComidasComponent implements OnInit {

  @Input() data: any;

  observacionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  fechaInicioF = new FormControl('', Validators.required);
  horaInicioF = new FormControl('', Validators.required);
  idEmpleadoF = new FormControl('');
  idComidaF = new FormControl('', Validators.required);
  fechaFinF = new FormControl('', Validators.required);
  horaFinF = new FormControl('', Validators.required);
  platosF = new FormControl('', Validators.required);;
  fechaF = new FormControl('', [Validators.required]);
  extraF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', Validators.required);;

  // ASIGNAR LOS CAMPOS DEL FORMULARIO EN GRUPO
  public PlanificacionComidasForm = new FormGroup({
    observacionForm: this.observacionF,
    fechaInicioForm: this.fechaInicioF,
    idEmpleadoForm: this.idEmpleadoF,
    horaInicioForm: this.horaInicioF,
    idComidaForm: this.idComidaF,
    fechaFinForm: this.fechaFinF,
    horaFinForm: this.horaFinF,
    platosForm: this.platosF,
    fechaForm: this.fechaF,
    extraForm: this.extraF,
    tipoForm: this.tipoF,
  });

  tipoComidas: any = [];
  empleados: any = [];
  FechaActual: any;
  idEmpleadoLogueado: any;

  constructor(
    private toastr: ToastrService,
    private parametro: ParametrosService,
    private rest: TipoComidasService,
    public restE: EmpleadoService,
    public restH: EmpleadoHorariosService,
    public aviso: RealTimeService,
    public validar: ValidacionesService,
    public restPlan: PlanComidasService,
    public restUsuario: UsuarioService,
    public compenentel: PlanComidasComponent,
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado') as string);
  }

  ngOnInit(): void {
    console.log('datos', this.data+ ' ' + this.data.length)
    var f = moment();
    this.FechaActual = f.format('YYYY-MM-DD');
    this.ObtenerServicios();
    this.BuscarParametro();
    this.MostrarDatos();
    this.BuscarFecha();
    this.BuscarHora();
  }

  /** **************************************************************************************** **
   ** **                   BUSQUEDA DE FORMATOS DE FECHAS Y HORAS                           ** ** 
   ** **************************************************************************************** **/

  formato_fecha: string = 'DD/MM/YYYY';
  formato_hora: string = 'HH:mm:ss';

  // METODO PARA BUSCAR PARAMETRO DE FORMATO DE FECHA
  BuscarFecha() {
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

  descripcion: string;

  // METODO PARA COLOCAR FECHA ACTUAL EN EL FORMULARIO
  MostrarDatos() {
    this.PlanificacionComidasForm.patchValue({
      fechaForm: this.FechaActual,
      extraForm: 'false'
    });
  }

  // METODO PARA OBTENER LISTA DE SERVICIOS
  servicios: any = [];
  ObtenerServicios() {
    this.servicios = [];
    this.restPlan.ObtenerTipoComidas().subscribe(datos => {
      this.servicios = datos;
    })
  }

  // AL SELECCIONAR UN TIPO DE SERVICIO SE MUESTRA LA LISTA DE MENÚS REGISTRADOS
  ObtenerPlatosComidas(form: any) {
    this.horaInicioF.reset();
    this.idComidaF.reset();
    this.horaFinF.reset();
    this.platosF.reset();
    this.tipoComidas = [];
    this.rest.ConsultarUnServicio(form.tipoForm).subscribe(datos => {
      this.tipoComidas = datos;
    }, error => {
      this.toastr.info('Verificar la información.', 'No se han encontrado registros.', {
        timeOut: 6000,
      })
    })
  }

  // METODO PARA OBTENER DETALLES DE ALIMENTACION
  detalle: any = [];
  ObtenerDetalleMenu(form: any) {
    this.horaInicioF.reset();
    this.horaFinF.reset();
    this.platosF.reset();
    this.detalle = [];
    this.rest.ConsultarUnDetalleMenu(form.idComidaForm).subscribe(datos => {
      this.detalle = datos;
      this.PlanificacionComidasForm.patchValue({
        horaInicioForm: this.detalle[0].hora_inicio,
        horaFinForm: this.detalle[0].hora_fin
      })
    }, error => {
      this.toastr.info('Verificar la información.', 'No se han encontrado registros.', {
        timeOut: 6000,
      })
    })
  }

  // METODO QUE REALIZA VALIDACIONES ANTES DEL REGISTRO
  fechasHorario: any = [];
  inicioDate: any;
  finDate: any;
  contador: number = 0;
  contadorFechas: number = 0;
  InsertarPlanificacion(form: any) {

    // DATOS DE PLANIFICACION
    let datosPlanComida = {
      observacion: form.observacionForm,
      hora_inicio: form.horaInicioForm,
      fec_inicio: form.fechaInicioForm,
      fec_comida: form.fechaInicioForm,
      id_comida: form.platosForm,
      fec_final: form.fechaFinForm,
      hora_fin: form.horaFinForm,
      fecha: form.fechaForm,
      extra: form.extraForm,
    };

    // METODO PARA VALIDAR FECHAS INGRESADAS
    if (Date.parse(form.fechaInicioForm) <= Date.parse(form.fechaFinForm)) {

      // METODO PARA VALIDAR REGISTRO INDIVIDUAL O MULTIPLE
      if (this.data.length != undefined) {
        this.ContarCorreos(this.data);
        if (this.cont_correo <= this.correos) {
          this.VerificarDuplicidadMultiple(form, datosPlanComida);
        }
        else {
          this.toastr.warning('Trata de enviar correo de un total de ' + this.cont_correo + ' colaboradores, sin embargo solo tiene permitido enviar un total de ' + this.correos + ' correos.', 'ACCIÓN NO PERMITIDA.', {
            timeOut: 6000,
          });
        }
      }
      else {
        this.VerificarDuplicidadIndividual(form, datosPlanComida);
      }
    }
    else {
      this.toastr.info('Las fechas no se han ingresado de manera correcta.', 'Verificar fechas registradas.', {
        timeOut: 6000,
      })
    }
  }

  // METODO PARA VALIDAR REGISTROS EXISTENTES
  VerificarDuplicidadIndividual(form: any, datosPlanComida: any) {
    // DATOS DEL USUARIO
    let datosDuplicados = {
      id: this.data.id,
      fecha_fin: form.fechaFinForm,
      fecha_inicio: form.fechaInicioForm,
    }
    // METODO QUE VALIDA SI EXISTE UN REGISTRO EN LAS FECHAS INDICADAS
    this.restPlan.BuscarDuplicadosFechas(datosDuplicados).subscribe(plan => {
      this.toastr.info(this.data.nombre + ' ya tiene registrada una planificación de alimentación en las fechas ingresadas.', '', {
        timeOut: 6000,
      })
    }, error => {
      // SI NO EXISTE PLANIFICACION VALIDAR HORARIO
      this.VerificarHorarioEmpleado(form, datosPlanComida);
    });
  }

  // METODO PARA VALIDAR PLANIFICACION HORARIA DEL USUARIO
  VerificarHorarioEmpleado(form, datosPlanComida) {
    // DATOS DE FCEHAS INGRESADAS
    let datosHorario = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinForm
    }
    // METODO PARA BUSCAR PLANIFICACION HORARIA
    this.restH.BuscarHorarioFechas(parseInt(this.data.codigo), datosHorario).subscribe(plan => {
      // REGISTRAR PLANIFICACIÓN 
      this.PlanificacionIndividual(form, datosPlanComida);
    }, error => {
      this.toastr.info(this.data.nombre + ' no tiene registro de horario laboral (planificación) en las fechas indicadas.', '', {
        timeOut: 6000,
      })
    });
  }

  // METODO PARA GUARDAR DATOS DE PLANIFICACION DE ALIMENTACION 
  PlanificacionIndividual(form: any, datosPlanComida: any) {
    // CREACIÓN DE LA PLANIFICACION PARA UN EMPLEADO
    this.restPlan.CrearPlanComidas(datosPlanComida).subscribe(res => {

      if (res.message != 'error') {
        var plan = res.info;
        console.log('ver plan ', plan)
        // INDICAMOS A QUE EMPLEADO SE LE REALIZA UNA PLANIFICACION
        this.inicioDate = moment(form.fechaInicioForm).format('MM-DD-YYYY');
        this.finDate = moment(form.fechaFinForm).format('MM-DD-YYYY');

        this.fechasHorario = []; // ARRAY QUE CONTIENE TODAS LAS FECHAS DEL MES INDICADO

        // INICIALIZAR DATOS DE FECHA
        var start = new Date(this.inicioDate);
        var end = new Date(this.finDate);

        // LÓGICA PARA OBTENER TODAS LAS FECHAS DEL MES
        while (start <= end) {
          this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
          var newDate = start.setDate(start.getDate() + 1);
          start = new Date(newDate);
        }

        this.contadorFechas = 0;

        // DATOS DE PLANIFICACION DE SERVICIO DE ALIMENTACION AL USUARIO
        let planEmpleado = {
          codigo: this.data.codigo,
          id_empleado: this.data.id,
          id_plan_comida: plan.id,
          fecha: '',
          hora_inicio: form.horaInicioForm,
          hora_fin: form.horaFinForm,
          consumido: false
        }

        // LECTURA DE DATOS DE USUARIO
        let usuario = '<tr><th>' + this.data.nombre +
          '</th><th>' + this.data.cedula + '</th></tr>';
        let cuenta_correo = this.data.correo;

        // LECTURA DE DATOS DE LA PLANIFICACIÓN
        let desde = this.validar.FormatearFecha(plan.fec_inicio, this.formato_fecha, this.validar.dia_completo);
        let hasta = this.validar.FormatearFecha(plan.fec_final, this.formato_fecha, this.validar.dia_completo);

        let h_inicio = this.validar.FormatearHora(plan.hora_inicio, this.formato_hora);
        let h_fin = this.validar.FormatearHora(plan.hora_fin, this.formato_hora);

        // REGISTRAR PLANIFICACION DEL USUARIO
        this.fechasHorario.map(obj => {
          planEmpleado.fecha = obj;

          // METODO PARA PLANIFICAR ALIMENTACION DEL USUARIO
          this.restPlan.CrearPlanComidasEmpleado(planEmpleado).subscribe(empl => {
            this.contadorFechas = this.contadorFechas + 1;

            // SI TODO LOS DATOS HAN SIDO LEIDOS SE ENVIA NOTIFICACIONES
            if (this.contadorFechas === this.fechasHorario.length) {
              this.NotificarPlanificacion(plan, desde, hasta, h_inicio, h_fin, this.data.id);
              this.EnviarCorreo(plan, cuenta_correo, usuario, desde, hasta, h_inicio, h_fin);
              this.toastr.success('Planificación Servicio de Alimentación registrada.', '', {
                timeOut: 6000,
              })
              this.CerrarRegistroPlanificacion();
            }
          });
        })
      }
      else {
        this.toastr.warning('Ups algo salio mal !!!', 'Proceso no registrado.', {
          timeOut: 6000,
        });
        this.CerrarRegistroPlanificacion();
      }
    });
  }

  // METODO PARA INGRESAR PLANIFICACION MULTIPLE
  empleados_conPlanificacion: any = [];
  empleados_sinPlanificacion: any = [];
  VerificarDuplicidadMultiple(form: any, datosPlanComida: any) {
    // LIMPIAR LISTA DE DATOS
    this.empleados_conPlanificacion = [];
    this.empleados_sinPlanificacion = [];
    // CONTADOR DE REGISTROS
    var contar_seleccionados = 0;
    // DATOS DE USUARIO
    let datosDuplicados = {
      id: '',
      fecha_inicio: form.fechaInicioForm,
      fecha_fin: form.fechaFinForm
    }
    // PROCESAR TODOS LOS DATOS
    this.data.map(obj => {
      datosDuplicados.id = obj.id;
      // METODO PARA VERIFICAR DATOS DUPLICADOS
      this.restPlan.BuscarDuplicadosFechas(datosDuplicados).subscribe(res => {

        contar_seleccionados = contar_seleccionados + 1;
        this.empleados_conPlanificacion = this.empleados_conPlanificacion.concat(obj);
        if (contar_seleccionados === this.data.length) {
          // METODO PARA VALIDAR REGISTRO DE HORARIO
          this.VerificarHorariosEmpleadosMultiples(form, datosPlanComida, this.empleados_sinPlanificacion, this.empleados_conPlanificacion);
        }

      }, error => {

        contar_seleccionados = contar_seleccionados + 1;
        this.empleados_sinPlanificacion = this.empleados_sinPlanificacion.concat(obj);
        if (contar_seleccionados === this.data.length) {
          // METODO PARA VALIDAR REGISTRO DE HORARIO 
          this.VerificarHorariosEmpleadosMultiples(form, datosPlanComida, this.empleados_sinPlanificacion, this.empleados_conPlanificacion);
        }

      });
    })
  }

  // METODO PARA VALIDAR REGISTRO DE PLANIFICACION DE LOS USUARIOS
  empleados_conHorario: any = [];
  empleados_sinHorario: any = [];
  VerificarHorariosEmpleadosMultiples(form: any, datosPlanComida: any, sin_planificacion: any, con_planificacion: any) {
    var contar_horario = 0;
    let datosHorario = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinForm
    }
    sin_planificacion.map(obj => {
      // METODO PARA BUSCAR EXISTENCIA DE HORARIO
      this.restH.BuscarHorarioFechas(obj.codigo, datosHorario).subscribe(res => {
        contar_horario = contar_horario + 1;
        this.empleados_conHorario = this.empleados_conHorario.concat(obj);
        if (contar_horario === sin_planificacion.length) {
          // METODO PARA GUARDAR PLANIFICACION
          this.PlanificarMultiple(form, datosPlanComida, this.empleados_conHorario);

          // MENSAJE DE USUARIOS CON NOVEDADES
          this.IndicarMensajePlanificados(con_planificacion);
          this.IndicarMensajeHorarios(this.empleados_sinHorario, sin_planificacion);
        }

      }, error => {

        contar_horario = contar_horario + 1;
        this.empleados_sinHorario = this.empleados_sinHorario.concat(obj);

        if (contar_horario === sin_planificacion.length) {
          // GUARDAR REGISTRO DE PLANIFICACION
          this.PlanificarMultiple(form, datosPlanComida, this.empleados_conHorario);

          // MOSTRAR MENSAJES DE USUARIOS CON NOVEDADES
          this.IndicarMensajePlanificados(con_planificacion);
          this.IndicarMensajeHorarios(this.empleados_sinHorario, sin_planificacion);
        }
      });
    })

  }

  // MENSAJE QUE INDICA QUE USUARIOS CUENTA CON PLANIFICACION
  IndicarMensajePlanificados(array_datos: any) {
    // VALIDAR QUE LA LISTA TENGA DATOS
    if (array_datos.length != 0) {
      // MENSAJE SI TODO LOS USUARIOS CUENTAN CON PLANIFICACION
      if (array_datos.length === this.data.length) {
        this.toastr.info('',
          'Los colaboradores ya cuenta con una planificación registrada en las fechas indicas.', {
          timeOut: 12000,
        })
        this.CerrarRegistroPlanificacion();
      }
      else {
        // MENSAJE SI ALGUNOS USUARIOS CUENTAN CON PLANIFICACION
        var nombres_empleados = '';
        array_datos.map(obj => {
          nombres_empleados = nombres_empleados + ' - ' + obj.nombre
        })
        this.toastr.info('',
          'Los siguientes colaboradores: ' + nombres_empleados + ' ya cuenta con una planificación en las fechas indicas.', {
          timeOut: 12000,
        })
      }
    }
  }

  // MENSAJE PARA INDICAR QUE LOS USUARIOS NO TIENE HORARIO
  IndicarMensajeHorarios(array_datos: any, sin_planificacion) {
    // VALIDAR QUE LA LISTA TENGA REGISTROS
    if (array_datos.length != 0) {
      // SI TODO LOS USUARIOS NO TIENEN REGISRO DE PLANIFICACION HORARIA
      if (array_datos.length === sin_planificacion.length) {
        this.toastr.info('',
          'Los colaboradores no tienen registrada planificación u horario en las fechas indicadas.', {
          timeOut: 12000,
        })
        this.CerrarRegistroPlanificacion();
      }
      else {
        // SI ALGUNOS USUARIOS O CUENTA CON PLANIFICACION HORARIA
        var nombres_empleados = '';
        array_datos.map(obj => {
          nombres_empleados = nombres_empleados + ' - ' + obj.nombre
        })
        this.toastr.info('',
          'Los siguientes colaboradores: ' + nombres_empleados +
          ' no tienen registrado palnificación u horario laboral en las fechas indicadas.', {
          timeOut: 12000,
        })
      }
    }
  }

  // METODO DE REGISTROS DE PLANIFICACION DE VARIOS USUARIOS
  PlanificarMultiple(form: any, datosPlanComida: any, empleados_planificados: any) {

    var usuario = '';

    if (empleados_planificados.length != 0) {

      this.inicioDate = moment(form.fechaInicioForm).format('MM-DD-YYYY');
      this.finDate = moment(form.fechaFinForm).format('MM-DD-YYYY');

      // CREACION DE LA PLANIFICACION PARA VARIOS EMPLEADOS
      this.restPlan.CrearPlanComidas(datosPlanComida).subscribe(res => {
        if (res.message != 'error') {
          var plan = res.info;

          // LECTURA DE DATOS DE LA PLANIFICACION
          let desde = this.validar.FormatearFecha(plan.fec_inicio, this.formato_fecha, this.validar.dia_completo);
          let hasta = this.validar.FormatearFecha(plan.fec_final, this.formato_fecha, this.validar.dia_completo);

          let h_inicio = this.validar.FormatearHora(plan.hora_inicio, this.formato_hora);
          let h_fin = this.validar.FormatearHora(plan.hora_fin, this.formato_hora);

          this.fechasHorario = []; // ARRAY QUE CONTIENE TODAS LAS FECHAS DEL MES INDICADO
          // INICIALIZAR DATOS DE FECHA
          var start = new Date(this.inicioDate);
          var end = new Date(this.finDate);
          // LÓGICA PARA OBTENER EL NOMBRE DE CADA UNO DE LOS DIA DEL PERIODO INDICADO
          while (start <= end) {
            this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
            var newDate = start.setDate(start.getDate() + 1);
            start = new Date(newDate);
          }

          // INDICAMOS A QUE EMPLEADO SE LE REALIZA UNA PLANIFICACION
          this.contador = 0;
          let planEmpleado = {
            codigo: '',
            id_empleado: '',
            id_plan_comida: plan.id,
            fecha: '',
            hora_inicio: form.horaInicioForm,
            hora_fin: form.horaFinForm,
            consumido: false
          }
          // LEER DATOS DE CADA USUARIOS
          empleados_planificados.map(obj => {
            planEmpleado.codigo = obj.codigo;
            planEmpleado.id_empleado = obj.id;

            // LECTURA DE NOMBRES DE USUARIOS
            usuario = usuario + '<tr><th>' + obj.nombre + '</th><th>' + obj.cedula + '</th></tr>';

            this.contadorFechas = 0;

            // LEER DATOS POR CADA FECHA
            this.fechasHorario.map(fec => {
              planEmpleado.fecha = fec;
              this.restPlan.CrearPlanComidasEmpleado(planEmpleado).subscribe(res => {
                this.contadorFechas = this.contadorFechas + 1;
                if (this.contadorFechas === this.fechasHorario.length) {
                  this.NotificarPlanificacion(plan, desde, hasta, h_inicio, h_fin, obj.id);
                }
              });
            })
            // CONTADOR DE USUARIOS A LOS QUE SE REGISTRARÁ PLANIFICACION
            this.contador = this.contador + 1;
            if (this.contador === empleados_planificados.length) {
              this.EnviarCorreo(plan, this.info_correo, usuario, desde, hasta, h_inicio, h_fin);
              this.toastr.success('',
                'Se ha registrado Planificación de alimentación a un total de ' + empleados_planificados.length + ' colaboradores.', {
                timeOut: 8000,
              })
              this.CerrarRegistroPlanificacion();
            }
          })
        }
      });
    }
    else {
      this.toastr.warning('Ups algo salio mal !!!', 'Proceso no registrado.', {
        timeOut: 6000,
      });
      this.CerrarRegistroPlanificacion();
    }
  }

  // METODO DE ENVIO DE CORREO DE PLANIFICACION DE SERVICIO DE ALIMENTACION
  EnviarCorreo(datos: any, cuenta_correo: any, usuario: any, desde: any, hasta: any, h_inicio: any, h_fin: any) {

    // DATOS DE ESTRUCTURA DEL CORREO
    let DataCorreo = {
      tipo_solicitud: 'REALIZA',
      observacion: datos.observacion,
      id_comida: datos.id_comida,
      id_envia: this.idEmpleadoLogueado,
      nombres: usuario,
      proceso: 'creado',
      asunto: 'PLANIFICACION DE ALIMENTACION',
      correo: cuenta_correo,
      inicio: h_inicio,
      extra: datos.extra,
      desde: desde,
      hasta: hasta,
      final: h_fin,
    }

    console.log('DATOS A ENVIARSE POR CORREO', DataCorreo);
    // METODO ENVIO DE CORREO DE PLANIFICACION DE ALIMENTACION
    this.restPlan.EnviarCorreoPlan(DataCorreo).subscribe(res => {
      if (res.message === 'ok') {
        this.toastr.success('Correo de planificación enviado exitosamente.', '', {
          timeOut: 6000,
        });
      }
      else {
        this.toastr.warning('Ups algo salio mal !!!', 'No fue posible enviar correo de planificación.', {
          timeOut: 6000,
        });
      }
      console.log(res.message);

    }, err => {
      const { access, message } = err.error.message;
      if (access === false) {
        this.toastr.error(message)
        this.CerrarRegistroPlanificacion();
      }
    })
  }


  // METODO DE ENVIO DE NOTIFICACIONES DE PLANIFICACION DE SERVICIO DE ALIMENTACION
  NotificarPlanificacion(datos: any, desde: any, hasta: any, h_inicio: any, h_fin: any, id_empleado_recibe: number) {
    let mensaje = {
      id_comida: datos.id_comida,
      id_empl_envia: this.idEmpleadoLogueado,
      id_empl_recive: id_empleado_recibe,
      tipo: 20, // PLANIFICACION DE ALIMENTACION
      mensaje: 'Planificación servicio de alimentación desde ' +
        desde + ' hasta ' + hasta +
        ' horario de ' + h_inicio + ' a ' + h_fin + ' servicio ',
    }
    this.restPlan.EnviarMensajePlanComida(mensaje).subscribe(res => {
      this.aviso.RecibirNuevosAvisos(res.respuesta);
    }, err => {
      const { access, message } = err.error.message;
      if (access === false) {
        this.toastr.error(message)
        this.CerrarRegistroPlanificacion();
      }
    })
  }

  // METODO PARA BUSCAR PARAMETRO DE CORREOS
  correos: number;
  BuscarParametro() {
    // id_tipo_parametro LIMITE DE CORREOS = 24
    let datos: any = [];
    this.parametro.ListarDetalleParametros(24).subscribe(
      res => {
        datos = res;
        if (datos.length != 0) {
          this.correos = parseInt(datos[0].descripcion)
        }
        else {
          this.correos = 0
        }
      });
  }

  // METODO PARA CONTAR CORREOS A ENVIARSE
  cont_correo: number = 0;
  info_correo: string = '';
  ContarCorreos(data: any) {
    this.cont_correo = 0;
    this.info_correo = '';
    data.forEach((obj: any) => {
      this.cont_correo = this.cont_correo + 1;
      if (this.info_correo === '') {
        this.info_correo = obj.correo;
      }
      else {
        this.info_correo = this.info_correo + ', ' + obj.correo;
      }
    })
  }

  // METODO PARA VERIFICAR INGRESO DE LETRAS
  IngresarSoloLetras(e: any) {
    return this.validar.IngresarSoloLetras(e);
  }

  // METODO PARA CERRAR VENTANA
  CerrarRegistroPlanificacion() {
    this.LimpiarCampos();
    this.compenentel.ver_lista = true;
    this.compenentel.ver_registrar = false;
    this.compenentel.LimpiarFormulario();
  }

  // METODO PARA LIMPIAR FORMULARIO
  LimpiarCampos() {
    this.PlanificacionComidasForm.reset();
    this.ObtenerServicios();
  }

}
