import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-editar-cargo',
  templateUrl: './editar-cargo.component.html',
  styleUrls: ['./editar-cargo.component.css']
})

export class EditarCargoComponent implements OnInit {

  @Input() idSelectCargo: number;
  @Input() idEmploy: string;

  // VARIABLES DE ALMACENAMIENTO
  cargo: any = [];
  departamento: any = [];
  sucursales: any = [];
  empresas: any = [];

  // VARIABLES DE FORMULARIO
  idDepartamento = new FormControl('', [Validators.required]);
  horaTrabaja = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(:[0-9][0-9])?$")]);
  fechaInicio = new FormControl('', Validators.required);
  fechaFinal = new FormControl('', Validators.required);
  idSucursal = new FormControl('', [Validators.required]);
  sueldo = new FormControl('', [Validators.required]);
  cargoF = new FormControl('', [Validators.minLength(3)]);
  tipoF = new FormControl('');

  // AGREGAR CAMPOS A UN GRUPO
  public formulario = new FormGroup({
    horaTrabajaForm: this.horaTrabaja,
    idSucursalForm: this.idSucursal,
    fecInicioForm: this.fechaInicio,
    fecFinalForm: this.fechaFinal,
    idDeparForm: this.idDepartamento,
    sueldoForm: this.sueldo,
    cargoForm: this.cargoF,
    tipoForm: this.tipoF
  });

  constructor(
    private restCatDepartamento: DepartamentosService,
    private restEmplCargos: EmplCargosService,
    private restSucursales: SucursalService,
    private restEmpleado: EmpleadoService,
    private verEmpleado: VerEmpleadoComponent,
    private validar: ValidacionesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerCargoEmpleado();
    this.FiltrarSucursales();
    this.BuscarTiposCargos();
    this.tipoCargo[this.tipoCargo.length] = { cargo: "OTRO" };
  }

  // METODO PARA LISTAR SUCURSALES
  FiltrarSucursales() {
    let idEmpre = parseInt(localStorage.getItem('empresa') as string);
    this.sucursales = [];
    this.restSucursales.BuscarSucursalEmpresa(idEmpre).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('No se han encontrado datos de Sucursales.', '', {
        timeOut: 6000,
      })
    })
  }

  // METODO PARA LISTAR DEARTAMENTOS SEGUN SUCURSAL
  ObtenerDepartamentos(form: any) {
    this.departamento = [];
    let idSucursal = form.idSucursalForm;
    this.restCatDepartamento.BuscarDepartamentoSucursal(idSucursal).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados', '', {
        timeOut: 6000,
      })
    });
  }

  // METODO DE BUSQUEDA DE DEPARTAMENTOS 
  ObtenerDepartamentosImprimir(id: number) {
    this.departamento = [];
    this.restCatDepartamento.BuscarDepartamentoSucursal(id).subscribe(datos => {
      this.departamento = datos;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados.', '', {
        timeOut: 6000,
      })
    });
  }

  // METODO PARA OBTENER DATOS DE CARGO
  id_empl_contrato: number;
  ObtenerCargoEmpleado() {
    this.restEmplCargos.BuscarCargoID(this.idSelectCargo).subscribe(res => {
      this.cargo = res;
      this.id_empl_contrato = this.cargo[0].id_empl_contrato;
      this.cargo.forEach(obj => {
        this.ObtenerDepartamentosImprimir(obj.id_sucursal);
        // FORMATEAR HORAS
        if (obj.hora_trabaja.split(':').length === 3) {
          this.horaTrabaja.setValue(obj.hora_trabaja.split(':')[0] + ':' + obj.hora_trabaja.split(':')[1]);
        }
        else if (obj.hora_trabaja.split(':').length === 2) {
          if (parseInt(obj.hora_trabaja.split(':')[0]) < 10) {
            this.horaTrabaja.setValue('0' + parseInt(obj.hora_trabaja.split(':')[0]) + ':00');
          }
          else {
            this.horaTrabaja.setValue(obj.hora_trabaja);
          }
        }
        this.formulario.patchValue({
          idSucursalForm: obj.id_sucursal,
          fecInicioForm: obj.fec_inicio,
          fecFinalForm: obj.fec_final,
          idDeparForm: obj.id_departamento,
          sueldoForm: obj.sueldo.split('.')[0],
          tipoForm: obj.cargo
        })
      });
    })
  }

  // METODO DE BUSQUEDA DE TIPO DE CARGOS
  tipoCargo: any = [];
  BuscarTiposCargos() {
    this.tipoCargo = [];
    this.restEmplCargos.ObtenerTipoCargos().subscribe(datos => {
      this.tipoCargo = datos;
      this.tipoCargo[this.tipoCargo.length] = { cargo: "OTRO" };
    })
  }

  // METODO PARA VALIDAR INFORMACION
  ValidarDatosRegistro(form: any) {
    let datosBusqueda = {
      id_contrato: this.id_empl_contrato
    }
    this.restEmpleado.BuscarFechaIdContrato(datosBusqueda).subscribe(response => {
      if (Date.parse(response[0].fec_ingreso.split('T')[0]) < Date.parse(form.fecInicioForm)) {
        if (Date.parse(form.fecInicioForm) < Date.parse(form.fecFinalForm)) {
          this.ActualizarEmpleadoCargo(form);
        }
        else {
          this.toastr.info(
            'La fecha de finalización de actividades debe ser posterior a la fecha de inicio de actividades.', '', {
            timeOut: 6000,
          })
        }
      }
      else {
        this.toastr.info(
          'La fecha de inicio de actividades no puede ser anterior a la fecha de ingreso de contrato.', '', {
          timeOut: 6000,
        });
      }
    });
  }

  // METODO PARA ACTUALIZAR REGISTRO
  ActualizarEmpleadoCargo(form: any) {
    let cargo = {
      id_departamento: form.idDeparForm,
      hora_trabaja: form.horaTrabajaForm,
      id_sucursal: form.idSucursalForm,
      fec_inicio: form.fecInicioForm,
      fec_final: form.fecFinalForm,
      sueldo: form.sueldoForm,
      cargo: form.tipoForm
    }
    // FORMATEAR HORAS
    if (cargo.hora_trabaja.split(':').length === 1) {
      if (parseInt(cargo.hora_trabaja) < 10) {
        cargo.hora_trabaja = '0' + parseInt(cargo.hora_trabaja) + ':00:00'
      }
      else {
        cargo.hora_trabaja = cargo.hora_trabaja + ':00:00'
      }
    }
    else {
      if (parseInt(cargo.hora_trabaja.split(':')[0]) < 10) {
        cargo.hora_trabaja = '0' + parseInt(cargo.hora_trabaja.split(':')[0]) + ':' + cargo.hora_trabaja.split(':')[1] + ':00'
      }
    }
    if (form.tipoForm === undefined) {
      this.IngresarTipoCargo(form, cargo);
    }
    else {
      this.restEmplCargos.ActualizarContratoEmpleado(this.idSelectCargo, this.id_empl_contrato, cargo).subscribe(res => {
        this.verEmpleado.ObtenerCargoEmpleado(this.idSelectCargo, this.verEmpleado.formato_fecha);
        this.Cancelar();
        this.toastr.success('Operación exitosa.', 'Registro actualizado.', {
          timeOut: 6000,
        });
      });
    }
  }


  // METODO PARA MOSTRAR INGRESO DE CARGO
  habilitarCargo: boolean = false;
  habilitarSeleccion: boolean = true;
  IngresarOtro(form: any) {
    if (form.tipoForm === undefined) {
      this.formulario.patchValue({
        cargoForm: '',
      });
      this.habilitarCargo = true;
      this.toastr.info('Ingresar nombre del nuevo cargo.', 'Etiqueta Cargo a desempeñar activa.', {
        timeOut: 6000,
      })
      this.habilitarSeleccion = false;
    }
  }

  // METODO PARA MOSTRAR LISTA DE TIPO CARGOS
  VerTiposCargos() {
    this.formulario.patchValue({
      cargoForm: '',
    });
    this.habilitarCargo = false;
    this.habilitarSeleccion = true;
  }

  // METODO PARA REGISTRAR TIPO CARGO
  IngresarTipoCargo(form: any, datos: any) {
    if (form.cargoForm != '') {
      let tipo_cargo = {
        cargo: form.cargoForm
      }
      this.restEmplCargos.CrearTipoCargo(tipo_cargo).subscribe(res => {
        datos.cargo = res.id;
        this.restEmplCargos.ActualizarContratoEmpleado(this.idSelectCargo, this.id_empl_contrato, datos).subscribe(res => {
          this.verEmpleado.ObtenerCargoEmpleado(this.idSelectCargo, this.verEmpleado.formato_fecha);
          this.Cancelar();
          this.toastr.success('Operación exitosa.', 'Registro actualizado.', {
            timeOut: 6000,
          });
        });
      });
    }
    else {
      this.toastr.info('Ingresar el nuevo cargo a desempeñar.', 'Verificar datos.', {
        timeOut: 6000,
      });
    }
  }

  // METODO PARA INGRESAR SOLO NUMEROS
  IngresarSoloNumeros(evt: any) {
    return this.validar.IngresarSoloNumeros(evt);
  }

  Cancelar() {
    this.verEmpleado.VerCargoEdicion(true);
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

  // MENSAJE QUE INDICA FORMATO DE INGRESO DE NUMERO DE HORAS
  ObtenerMensajeErrorHoraTrabajo() {
    if (this.horaTrabaja.hasError('pattern')) {
      return 'Indicar horas y minutos. Ejemplo: 12:05';
    }
  }
}
