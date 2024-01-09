import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// IMPORTACION DE SERVICIOS
import { AccionPersonalService } from 'src/app/servicios/accionPersonal/accion-personal.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { ParametrosService } from 'src/app/servicios/parametrosGenerales/parametros.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
import { ListarPedidoAccionComponent } from '../listar-pedido-accion/listar-pedido-accion.component';

@Component({
  selector: 'app-ver-pedido-accion',
  templateUrl: './ver-pedido-accion.component.html',
  styleUrls: ['./ver-pedido-accion.component.css']
})

export class VerPedidoAccionComponent implements OnInit {

  @Input() idPedido: number;

  // INICIACION DE VARIABLES 
  idEmpleadoLogueado: any;
  empleados: any = [];
  departamento: any;

  constructor(
    public restProcesos: ProcesoService,
    public restEmpresa: EmpresaService,
    public componentel: ListarPedidoAccionComponent,
    public restAccion: AccionPersonalService,
    public parametro: ParametrosService,
    public validar: ValidacionesService,
    public router: Router,
    public restE: EmpleadoService,
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado') as string);
    this.departamento = parseInt(localStorage.getItem("departamento") as string);
  }

  ngOnInit(): void {
    this.BuscarParametro();
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
        this.CargarInformacion(this.formato_fecha)
      },
      vacio => {
        this.CargarInformacion(this.formato_fecha)
      });
  }

  datosPedido: any = [];
  datoEmpleado: string = '';
  datoEmpleadoH: string = '';
  datoEmpleadoG: string = '';
  datoEmpleadoR: string = '';
  sueldo: string = '';
  ciudad: string = '';
  cargo: string = '';
  cargoH: string = '';
  cargoG: string = '';
  cargoR: string = '';
  cargop: string = '';
  decreto: string = '';
  departamentoE: string = '';
  proceso: string = '';
  cedula: string = '';
  CargarInformacion(formato_fecha: string) {
    this.restAccion.BuscarDatosPedidoId(this.idPedido).subscribe(data => {
      this.datosPedido = data;
      this.datosPedido[0].fec_creacion_ = this.validar.FormatearFecha(this.datosPedido[0].fec_creacion, formato_fecha, this.validar.dia_completo);
      this.datosPedido[0].fec_rige_desde_ = this.validar.FormatearFecha(this.datosPedido[0].fec_rige_desde, formato_fecha, this.validar.dia_completo);
      this.datosPedido[0].fec_rige_hasta_ = this.validar.FormatearFecha(this.datosPedido[0].fec_rige_hasta, formato_fecha, this.validar.dia_completo);
      this.datosPedido[0].primera_fecha_reemp_ = this.validar.FormatearFecha(this.datosPedido[0].primera_fecha_reemp, formato_fecha, this.validar.dia_completo);
      this.datosPedido[0].fec_act_final_concurso_ = this.validar.FormatearFecha(this.datosPedido[0].fec_act_final_concurso, formato_fecha, this.validar.dia_completo);
      console.log('datos', this.datosPedido);
      this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].id_empleado).subscribe(data1 => {
        console.log('empleado', data1)
        this.datoEmpleado = data1[0].apellido + ' ' + data1[0].nombre;
        this.sueldo = data1[0].sueldo;
        this.cargo = data1[0].cargo;
        this.departamentoE = data1[0].departamento;
        this.cedula = data1[0].cedula;
        this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].firma_empl_uno).subscribe(data2 => {
          this.datoEmpleadoH = data2[0].apellido + ' ' + data2[0].nombre;
          this.cargoH = data2[0].cargo;
          this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].firma_empl_dos).subscribe(data3 => {
            this.datoEmpleadoG = data3[0].apellido + ' ' + data3[0].nombre;
            this.cargoG = data3[0].cargo;
            this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].id_empl_responsable).subscribe(data4 => {
              this.datoEmpleadoR = data4[0].apellido + ' ' + data4[0].nombre;
              this.cargoR = data4[0].cargo;
            });
            this.restAccion.BuscarDatosPedidoCiudades(this.datosPedido[0].id_ciudad).subscribe(data5 => {
              this.ciudad = data5[0].descripcion;
            });
            this.restProcesos.getOneProcesoRest(this.datosPedido[0].proceso_propuesto).subscribe(data6 => {
              this.proceso = data6[0].nombre;
            });
            this.restAccion.ConsultarUnCargoPropuesto(this.datosPedido[0].cargo_propuesto).subscribe(data7 => {
              this.cargop = data7[0].descripcion;
            });
            this.restAccion.ConsultarUnDecreto(this.datosPedido[0].decre_acue_resol).subscribe(data8 => {
              this.decreto = data8[0].descripcion;
            });
          });
        });
      });
    })
  }

  // METODO PARA VER LISTA DE PEDIDOS
  VerListaPedidos() {
    this.componentel.ver_lista = true;
    this.componentel.ver_datos = false;
    this.componentel.VerDatosAcciones();
  }

  // METODO PARA ABRIR EDITAR
  AbrirEditar(id: number) {
    this.componentel.ver_editar = true;
    this.componentel.ver_datos = false;
    this.componentel.pagina = 'datos-pedido';
    this.componentel.pedido_id = id;
  }

}
