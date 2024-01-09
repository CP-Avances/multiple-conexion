// SECCION DE LIBRERIAS
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material/radio';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

// IMPORTAR MODELOS
import { checkOptions, FormCriteriosBusqueda } from 'src/app/model/reportes.model';
import { ITableEmpleados } from 'src/app/model/reportes.model';

// SECCION DE SERVICIOS
import { EmpleadoUbicacionService } from 'src/app/servicios/empleadoUbicacion/empleado-ubicacion.service';
import { DatosGeneralesService } from 'src/app/servicios/datosGenerales/datos-generales.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';
import { ParametrosService } from 'src/app/servicios/parametrosGenerales/parametros.service';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';

import { EditarCoordenadasComponent } from '../editar-coordenadas/editar-coordenadas.component';
import { ListarCoordenadasComponent } from '../listar-coordenadas/listar-coordenadas.component';
import { MetodosComponent } from 'src/app/componentes/administracionGeneral/metodoEliminar/metodos.component';

export interface EmpleadoElemento {
  id_emplu: number;
  nombre: string;
  apellido: string;
  codigo: number;
  id_ubicacion: number;
}

@Component({
  selector: 'app-ver-coordenadas',
  templateUrl: './ver-coordenadas.component.html',
  styleUrls: ['./ver-coordenadas.component.css']
})

export class VerCoordenadasComponent implements OnInit {

  @Input() idUbicacion: number;

  asignar: boolean = false;

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre_emp = new FormControl('', [Validators.minLength(2)]);
  nombre_dep = new FormControl('', [Validators.minLength(2)]);
  nombre_suc = new FormControl('', [Validators.minLength(2)]);
  nombre_carg = new FormControl('', [Validators.minLength(2)]);
  nombre_reg = new FormControl('', [Validators.minLength(2)]);
  seleccion = new FormControl('');

  public _booleanOptions: FormCriteriosBusqueda = {
    bool_suc: false,
    bool_dep: false,
    bool_emp: false,
    bool_reg: false,
    bool_cargo: false,
  };

  // PRESENTACION DE INFORMACION DE ACUERDO AL CRITERIO DE BUSQUEDA
  selectionSuc = new SelectionModel<ITableEmpleados>(true, []);
  selectionCarg = new SelectionModel<ITableEmpleados>(true, []);
  selectionDep = new SelectionModel<ITableEmpleados>(true, []);
  selectionEmp = new SelectionModel<ITableEmpleados>(true, []);
  selectionReg = new SelectionModel<ITableEmpleados>(true, []);

  public check: checkOptions[];

  departamentos: any = [];
  sucursales: any = [];
  empleados: any = [];
  respuesta: any[];
  regimen: any = [];
  origen: any = [];
  data_pdf: any = [];

  // ITEMS DE PAGINACION DE LA TABLA SUCURSAL
  pageSizeOptions_suc = [5, 10, 20, 50];
  tamanio_pagina_suc: number = 5;
  numero_pagina_suc: number = 1;

  // ITEMS DE PAGINACION DE LA TABLA REGIMEN
  pageSizeOptions_reg = [5, 10, 20, 50];
  tamanio_pagina_reg: number = 5;
  numero_pagina_reg: number = 1;

  // ITEMS DE PAGINACION DE LA TABLA CARGO
  pageSizeOptions_car = [5, 10, 20, 50];
  tamanio_pagina_car: number = 5;
  numero_pagina_car: number = 1;

  // ITEMS DE PAGINACION DE LA TABLA DEPARTAMENTO
  pageSizeOptions_dep = [5, 10, 20, 50];
  tamanio_pagina_dep: number = 5;
  numero_pagina_dep: number = 1;

  // ITEMS DE PAGINACION DE LA TABLA EMPLEADOS
  pageSizeOptions_emp = [5, 10, 20, 50];
  tamanio_pagina_emp: number = 5;
  numero_pagina_emp: number = 1;

  // FILTROS SUCURSALES
  filtroNombreSuc_: string = '';
  get filtroNombreSuc() { return this.filtros.filtroNombreSuc }

  // FILTROS DEPARTAMENTOS
  filtroNombreDep_: string = '';
  get filtroNombreDep() { return this.filtros.filtroNombreDep }

  // FILTROS EMPLEADO
  filtroCodigo_: any;
  filtroCedula_: string = '';
  filtroNombreEmp_: string = '';
  get filtroNombreEmp() { return this.filtros.filtroNombreEmp };
  get filtroCodigo() { return this.filtros.filtroCodigo };
  get filtroCedula() { return this.filtros.filtroCedula };

  // FILTRO CARGOS
  filtroNombreCarg_: string = '';
  get filtroNombreCarg() { return this.filtros.filtroNombreCarg };

  // FILTRO REGIMEN
  filtroNombreReg_: string = '';
  get filtroNombreReg() { return this.filtros.filtroNombreReg };

  coordenadas: any = [];
  datosUsuarios: any = [];

  // ITEMS DE PAGINACION DE LA TABLA
  numero_pagina: number = 1;
  tamanio_pagina: number = 5;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private toastr: ToastrService,
    public restU: EmpleadoUbicacionService,
    public restP: ParametrosService,
    public router: Router,
    public ventana: MatDialog,
    private filtros: ReportesService,
    private validar: ValidacionesService,
    public informacion: DatosGeneralesService,
    public componentec: ListarCoordenadasComponent,
  ) { }

  ngOnInit(): void {
    this.check = this.filtros.checkOptions([{ opcion: 's' }, { opcion: 'r' }, { opcion: 'c' }, { opcion: 'd' }, { opcion: 'e' }]);
    this.ConsultarDatos();
  }

  // METODO PARA CONSULTAR INFORMACION
  ConsultarDatos() {
    this.BuscarUbicacion(this.idUbicacion);
    this.ListarUsuarios(this.idUbicacion);
    this.BuscarInformacion();
    this.BuscarCargos();
  }

  ngOnDestroy() {
    this.filtros.GuardarCheckOpcion('');
    this.filtros.DefaultFormCriterios();
    this.filtros.DefaultValoresFiltros();
    this.origen = [];
    this.origen_cargo = [];
  }

  // METODO PARA ACTIVAR SELECCION MULTIPLE PARA ELIMINAR
  btnCheckHabilitar: boolean = false;
  auto_individual: boolean = true;
  HabilitarSeleccion() {
    if (this.btnCheckHabilitar === false) {
      this.btnCheckHabilitar = true;
      this.auto_individual = false;
    }
    else if (this.btnCheckHabilitar === true) {
      this.btnCheckHabilitar = false;
      this.auto_individual = true;
    }
  }

  // METODO PARA MANEJAR PAGINACION DE TABLAS
  ManejarPagina(e: PageEvent) {
    this.numero_pagina = e.pageIndex + 1
    this.tamanio_pagina = e.pageSize;
  }

  // METODO PARA BUSCAR DATOS DE UBICACIÓN GEOGRÁFICA
  BuscarUbicacion(id: any) {
    this.coordenadas = [];
    this.restU.ListarUnaCoordenada(id).subscribe(data => {
      this.coordenadas = data;
    })
  }

  // METODO PARA BUSCAR DETALLES DE PARAMETRO GENERAL
  ListarUsuarios(id: number) {
    this.datosUsuarios = [];
    this.restU.ListarCoordenadasUsuarioU(id).subscribe(datos => {
      this.datosUsuarios = datos;
    })
  }

  // METODO PARA ASIGNAR UBICACION A USUARIOS
  AbrirVentanaBusqueda(): void {
    if (this.asignar === true) {
      this.asignar = false;
      this.filtros.DefaultFormCriterios();
      this.filtros.DefaultValoresFiltros();
      this.seleccion.reset();
    } else {
      this.asignar = true;
    }
  }

  // METODO PARA EDITAR COORDENADAS
  AbrirVentanaEditar(datos: any): void {
    this.ventana.open(EditarCoordenadasComponent,
      { width: '400px', data: { ubicacion: datos, actualizar: true } }).afterClosed().subscribe(item => {
        this.BuscarUbicacion(this.idUbicacion);
        this.ListarUsuarios(this.idUbicacion);
      });
  }

  // FUNCION PARA ELIMINAR REGISTRO SELECCIONADO 
  EliminarRegistro(id_emplu: number) {
    this.restU.EliminarCoordenadasUsuario(id_emplu).subscribe(res => {
      this.toastr.error('Registro eliminado.', '', {
        timeOut: 6000,
      });
      this.ConsultarDatos();
    });
  }

  // FUNCION PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
  ConfirmarDelete(datos: any) {
    this.ventana.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarRegistro(datos.id_emplu);
        }
      });
  }


  // BUSCAR DATOS DE USUARIOS
  BuscarInformacion() {
    this.departamentos = [];
    this.sucursales = [];
    this.empleados = [];
    this.origen = [];
    this.regimen = [];
    let ubicacion = {
      ubicacion: this.idUbicacion
    }
    this.informacion.ObtenerInformacionUbicacion(1, ubicacion).subscribe((res: any[]) => {
      this.origen = JSON.stringify(res);

      res.forEach(obj => {
        this.sucursales.push({
          id: obj.id_suc,
          nombre: obj.name_suc
        })
      })

      res.forEach(obj => {
        obj.departamentos.forEach(ele => {
          this.departamentos.push({
            id: ele.id_depa,
            departamento: ele.name_dep,
            nombre: ele.sucursal
          })
        })
      })

      res.forEach(obj => {
        obj.departamentos.forEach(ele => {
          ele.empleado.forEach(r => {
            let elemento = {
              id: r.id,
              nombre: r.name_empleado,
              codigo: r.codigo,
              cedula: r.cedula,
              correo: r.correo,
              id_cargo: r.id_cargo,
              id_contrato: r.id_contrato,
            }
            this.empleados.push(elemento)
          })
        })
      })

      res.forEach(obj => {
        obj.departamentos.forEach(ele => {
          ele.empleado.forEach(reg => {
            reg.regimen.forEach(r => {
              this.regimen.push({
                id: r.id_regimen,
                nombre: r.name_regimen
              })
            })
          })
        })
      })

      this.regimen = this.regimen.filter((obj, index, self) =>
        index === self.findIndex((o) => o.id === obj.id)
      );

    })
  }

  // METODO PARA FILTRAR POR CARGOS
  empleados_cargos: any = [];
  origen_cargo: any = [];
  cargos: any = [];
  BuscarCargos() {
    this.empleados_cargos = [];
    this.origen_cargo = [];
    this.cargos = [];
    let ubicacion = {
      ubicacion: this.idUbicacion
    }
    this.informacion.ObtenerInformacionCargosUbicacion(1, ubicacion).subscribe((res: any[]) => {
      this.origen_cargo = JSON.stringify(res);

      res.forEach(obj => {
        this.cargos.push({
          id: obj.id_cargo,
          nombre: obj.name_cargo,
        })
      })

      res.forEach(obj => {
        obj.empleados.forEach(r => {
          this.empleados_cargos.push({
            id: r.id,
            nombre: r.name_empleado,
            codigo: r.codigo,
            cedula: r.cedula,
            correo: r.correo,
            id_cargo: r.id_cargo,
            id_contrato: r.id_contrato,
            hora_trabaja: r.hora_trabaja
          })
        })
      })
    })
  }

  // METODO PARA ACTIVAR SELECCION MULTIPLE
  multiple: boolean = false;
  multiple_: boolean = false;
  activar_seleccion: boolean = true;
  HabilitarSeleccion_() {
    this.multiple = true;
    this.multiple_ = true;
    this.activar_seleccion = false;
  }

  // METODO PARA MOSTRAR DATOS DE BUSQUEDA
  opcion: string;
  BuscarPorTipo(e: MatRadioChange) {
    this.opcion = e.value;
    this.MostrarLista();
    switch (this.opcion) {
      case 's':
        this.ControlarOpciones(true, false, false, false, false);
        this.ControlarBotones(true, false);
        break;
      case 'r':
        this.ControlarOpciones(false, false, false, false, true);
        this.ControlarBotones(true, false);
        break;
      case 'c':
        this.ControlarOpciones(false, true, false, false, false);
        this.ControlarBotones(true, false);
        break;
      case 'd':
        this.ControlarOpciones(false, false, true, false, false);
        this.ControlarBotones(true, false);
        break;
      case 'e':
        this.ControlarOpciones(false, false, false, true, false);
        this.ControlarBotones(true, false);
        break;
      default:
        this.ControlarOpciones(false, false, false, false, false);
        this.ControlarBotones(true, false);
        break;
    }
    this.filtros.GuardarFormCriteriosBusqueda(this._booleanOptions);
    this.filtros.GuardarCheckOpcion(this.opcion)
  }

  // METODO PARA CONTROLAR OPCIONES DE BUSQUEDA
  ControlarOpciones(sucursal: boolean, cargo: boolean, departamento: boolean, empleado: boolean, regimen: boolean) {
    this._booleanOptions.bool_suc = sucursal;
    this._booleanOptions.bool_cargo = cargo;
    this._booleanOptions.bool_dep = departamento;
    this._booleanOptions.bool_emp = empleado;
    this._booleanOptions.bool_reg = regimen;
  }

  // METODO PARA CONTROLAR VISTA DE BOTONES
  ControlarBotones(seleccion: boolean, multiple: boolean) {
    this.activar_seleccion = seleccion;
    this.multiple = multiple;
    this.multiple_ = multiple;
  }

  // METODO PARA FILTRAR DATOS DE BUSQUEDA
  Filtrar(e: any, orden: number) {
    this.ControlarFiltrado(e);
    switch (orden) {
      case 1: this.filtros.setFiltroNombreSuc(e); break;
      case 2: this.filtros.setFiltroNombreCarg(e); break;
      case 3: this.filtros.setFiltroNombreDep(e); break;
      case 4: this.filtros.setFiltroCodigo(e); break;
      case 5: this.filtros.setFiltroCedula(e); break;
      case 6: this.filtros.setFiltroNombreEmp(e); break;
      case 7: this.filtros.setFiltroNombreReg(e); break;
      default:
        break;
    }
  }

  // METODO PARA CONTROLAR FILTROS DE BUSQUEDA
  ControlarFiltrado(e: any) {
    if (e === '') {
      if (this.multiple === true) {
        this.activar_seleccion = false;
      }
      else {
        if (this.activar_seleccion === false) {
          this.multiple = true;
        }
      }
    }
    else {
      if (this.activar_seleccion === true) {
        this.activar_seleccion = false;
        this.multiple_ = true;
      }
      else {
        this.multiple = false;
      }
    }
  }

  // METODOS DE VALIDACION DE INGRESO DE LETRAS Y NUMEROS
  IngresarSoloLetras(e: any) {
    return this.validar.IngresarSoloLetras(e);
  }

  IngresarSoloNumeros(evt: any) {
    return this.validar.IngresarSoloNumeros(evt);
  }

  // METODO PARA LIMPIAR FORMULARIOS
  LimpiarCampos() {
    if (this._booleanOptions.bool_emp) {
      this.codigo.reset();
      this.cedula.reset();
      this.nombre_emp.reset();
      this._booleanOptions.bool_emp = false;
      this.selectionEmp.deselect();
      this.selectionEmp.clear();
    }

    if (this._booleanOptions.bool_reg) {
      this.nombre_reg.reset();
      this._booleanOptions.bool_reg = false;
      this.selectionReg.deselect();
      this.selectionReg.clear();
    }

    if (this._booleanOptions.bool_dep) {
      this.nombre_dep.reset();
      this._booleanOptions.bool_dep = false;
      this.selectionDep.clear();
      this.selectionDep.deselect();
    }

    if (this._booleanOptions.bool_suc) {
      this.nombre_suc.reset();
      this._booleanOptions.bool_suc = false;
      this.selectionSuc.deselect();
      this.selectionSuc.clear();
    }

    if (this._booleanOptions.bool_cargo) {
      this._booleanOptions.bool_cargo = false;
      this.selectionCarg.deselect();
      this.selectionCarg.clear();
    }

    this.seleccion.reset();
    this.asignar = false;
  }

  // MOSTRAR DATOS DE EMPRESA
  MostrarLista() {
    if (this.opcion === 's') {
      this.nombre_suc.reset();
      this.filtroNombreSuc_ = '';
      this.selectionDep.clear();
      this.selectionCarg.clear();
      this.selectionEmp.clear();
      this.selectionReg.clear();
      this.Filtrar('', 1)
    }
    else if (this.opcion === 'r') {
      this.nombre_reg.reset();
      this.filtroNombreReg_ = '';
      this.selectionDep.clear();
      this.selectionCarg.clear();
      this.selectionEmp.clear();
      this.selectionSuc.clear();
      this.Filtrar('', 7)
    }
    else if (this.opcion === 'c') {
      this.nombre_carg.reset();
      this.filtroNombreCarg_ = '';
      this.selectionEmp.clear();
      this.selectionDep.clear();
      this.selectionSuc.clear();
      this.selectionReg.clear();
      this.Filtrar('', 2)
    }
    else if (this.opcion === 'd') {
      this.nombre_dep.reset();
      this.filtroNombreDep_ = '';
      this.nombre_suc.reset();
      this.filtroNombreSuc_ = '';
      this.selectionEmp.clear();
      this.selectionCarg.clear();
      this.selectionSuc.clear();
      this.selectionReg.clear();
      this.Filtrar('', 1)
      this.Filtrar('', 3)
    }
    else if (this.opcion === 'e') {
      this.codigo.reset();
      this.cedula.reset();
      this.nombre_emp.reset();
      this.filtroCodigo_ = '';
      this.filtroCedula_ = '';
      this.filtroNombreEmp_ = '';
      this.selectionDep.clear();
      this.selectionCarg.clear();
      this.selectionSuc.clear();
      this.selectionReg.clear();
      this.Filtrar('', 4)
      this.Filtrar('', 5)
      this.Filtrar('', 6)
    }
  }

  /** ************************************************************************************** **
   ** **                   METODOS DE SELECCION DE DATOS DE USUARIOS                      ** **
   ** ************************************************************************************** **/

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS. 
  isAllSelectedCarg() {
    const numSelected = this.selectionCarg.selected.length;
    return numSelected === this.cargos.length
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA. 
  masterToggleCarg() {
    this.isAllSelectedCarg() ?
      this.selectionCarg.clear() :
      this.cargos.forEach(row => this.selectionCarg.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabelCarg(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedCarg() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionCarg.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS. 
  isAllSelectedReg() {
    const numSelected = this.selectionReg.selected.length;
    return numSelected === this.regimen.length
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA. 
  masterToggleReg() {
    this.isAllSelectedReg() ?
      this.selectionReg.clear() :
      this.regimen.forEach(row => this.selectionReg.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabelReg(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedReg() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionReg.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS. 
  isAllSelectedSuc() {
    const numSelected = this.selectionSuc.selected.length;
    return numSelected === this.sucursales.length
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA. 
  masterToggleSuc() {
    this.isAllSelectedSuc() ?
      this.selectionSuc.clear() :
      this.sucursales.forEach(row => this.selectionSuc.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabelSuc(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedSuc() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionSuc.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS. 
  isAllSelectedDep() {
    const numSelected = this.selectionDep.selected.length;
    return numSelected === this.departamentos.length
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA. 
  masterToggleDep() {
    this.isAllSelectedDep() ?
      this.selectionDep.clear() :
      this.departamentos.forEach(row => this.selectionDep.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabelDep(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedDep() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionDep.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS. 
  isAllSelectedEmp() {
    const numSelected = this.selectionEmp.selected.length;
    return numSelected === this.empleados.length
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA. 
  masterToggleEmp() {
    this.isAllSelectedEmp() ?
      this.selectionEmp.clear() :
      this.empleados.forEach(row => this.selectionEmp.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabelEmp(row?: ITableEmpleados): string {
    if (!row) {
      return `${this.isAllSelectedEmp() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEmp.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // METODO DE PAGINACION DE DATOS
  ManejarPaginaResultados(e: PageEvent) {
    if (this._booleanOptions.bool_suc === true) {
      this.tamanio_pagina_suc = e.pageSize;
      this.numero_pagina_suc = e.pageIndex + 1;
    }
    else if (this._booleanOptions.bool_dep === true) {
      this.tamanio_pagina_dep = e.pageSize;
      this.numero_pagina_dep = e.pageIndex + 1;
    }
    else if (this._booleanOptions.bool_emp === true) {
      this.tamanio_pagina_emp = e.pageSize;
      this.numero_pagina_emp = e.pageIndex + 1;
    }
    else if (this._booleanOptions.bool_cargo === true) {
      this.tamanio_pagina_car = e.pageSize;
      this.numero_pagina_car = e.pageIndex + 1;
    }
    else if (this._booleanOptions.bool_reg === true) {
      this.tamanio_pagina_reg = e.pageSize;
      this.numero_pagina_reg = e.pageIndex + 1;
    }
  }

  // METODO PARA PRESENTAR DATOS DE SUCURSALES
  ModelarSucursal() {
    let usuarios: any = [];
    let respuesta = JSON.parse(this.origen)
    respuesta.forEach((obj: any) => {
      this.selectionSuc.selected.find(obj1 => {
        if (obj.id_suc === obj1.id) {
          obj.departamentos.forEach((obj2: any) => {
            obj2.empleado.forEach((obj3: any) => {
              usuarios.push(obj3)
            })
          })
        }
      })
    })

    this.RegistrarUbicacionUsuario(usuarios);
  }

  // CONSULTA DE LOS DATOS REGIMEN
  ModelarRegimen() {
    let usuarios: any = [];
    let respuesta = JSON.parse(this.origen)
    respuesta.forEach((obj: any) => {
      obj.departamentos.forEach((obj1: any) => {
        obj1.empleado.forEach((obj2: any) => {
          this.selectionReg.selected.find(obj3 => {
            obj2.regimen.forEach((obj4: any) => {
              if (obj3.id === obj4.id_regimen) {
                usuarios.push(obj2);
              }
            })
          })
        })
      })
    })
    this.RegistrarUbicacionUsuario(usuarios);
  }

  // METODO PARA MOSTRAR DATOS DE CARGOS
  ModelarCargo() {
    let usuarios: any = [];
    let respuesta = JSON.parse(this.origen_cargo)
    respuesta.forEach((obj: any) => {
      this.selectionCarg.selected.find(obj1 => {
        if (obj.id_cargo === obj1.id) {
          obj.empleados.forEach((obj3: any) => {
            usuarios.push(obj3)
          })
        }
      })
    })
    this.RegistrarUbicacionUsuario(usuarios);
  }

  // METODO PARA PRESENTAR DATOS DE EMPLEADO
  ModelarEmpleados() {
    let respuesta: any = [];
    this.empleados.forEach((obj: any) => {
      this.selectionEmp.selected.find(obj1 => {
        if (obj1.id === obj.id) {
          respuesta.push(obj)
        }
      })
    })
    this.RegistrarUbicacionUsuario(respuesta);
  }

  // METODO PARA PRESENTAR DATOS DE DEPARTAMENTOS
  ModelarDepartamentos() {
    let usuarios: any = [];
    let respuesta = JSON.parse(this.origen)
    respuesta.forEach((obj: any) => {
      obj.departamentos.forEach((obj1: any) => {
        this.selectionDep.selected.find(obj2 => {
          if (obj1.id_depa === obj2.id) {
            obj1.empleado.forEach((obj3: any) => {
              usuarios.push(obj3)
            })
          }
        })
      })
    })
    this.RegistrarUbicacionUsuario(usuarios);
  }

  /** ************************************************************************************** **
   ** **                       METODOS DE REGISTRO DE UBICACIONES                         ** ** 
   ** ************************************************************************************** **/

  // METODO PARA REGISTRAR UBICACIONES
  cont: number = 0;
  RegistrarUbicacionUsuario(data: any) {
    if (data.length > 0) {
      this.cont = 0;
      data.forEach((obj: any) => {
        var datos = {
          id_empl: obj.id,
          codigo: obj.codigo,
          id_ubicacion: this.idUbicacion
        }
        this.restU.RegistrarCoordenadasUsuario(datos).subscribe(res => {
          this.cont = this.cont + 1;
          if (this.cont === data.length) {
            this.toastr.success('Registros de ubicación asignados exitosamente.', '', {
              timeOut: 6000,
            });
            this.ConsultarDatos();
            this.AbrirVentanaBusqueda();
          }
        });
      })
    }
    else {
      this.toastr.warning('No ha seleccionado usuarios.', '', {
        timeOut: 6000,
      });
    }

  }

  // METODO PARA TOMAR DATOS SELECCIONADOS
  GuardarRegistros() {
    if (this.opcion === 's') {
      this.ModelarSucursal();
    }
    else if (this.opcion === 'r') {
      this.ModelarRegimen();
    }
    else if (this.opcion === 'c') {
      this.ModelarCargo();
    }
    else if (this.opcion === 'd') {
      this.ModelarDepartamentos();
    }
    else {
      this.ModelarEmpleados();
    }
  }


  /** ************************************************************************************** **
   ** **           METODOS DE SELECCION DE DATOS DE USUARIOS ELIMINAR UBICACION           ** **
   ** ************************************************************************************** **/

  selectionUno = new SelectionModel<EmpleadoElemento>(true, []);

  // SI EL NUMERO DE ELEMENTOS SELECCIONADOS COINCIDE CON EL NUMERO TOTAL DE FILAS.
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.datosUsuarios.length;
    return numSelected === numRows;
  }

  // SELECCIONA TODAS LAS FILAS SI NO ESTAN TODAS SELECCIONADAS; DE LO CONTRARIO, SELECCION CLARA.
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.datosUsuarios.forEach(row => this.selectionUno.select(row));
  }

  // LA ETIQUETA DE LA CASILLA DE VERIFICACION EN LA FILA PASADA
  checkboxLabel(row?: EmpleadoElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id_emplu + 1}`;
  }

  // METODO PARA ELIMNAR REGISTROS DE UBICACION
  Remover() {
    let EmpleadosSeleccionados: any;
    EmpleadosSeleccionados = this.selectionUno.selected.map(obj => {
      return {
        id_emplu: obj.id_emplu,
        empleado: obj.nombre + ' ' + obj.apellido,
        codigo: obj.codigo,
        id_ubicacion: obj.id_ubicacion
      }
    })
    if (EmpleadosSeleccionados.length > 0) {
      EmpleadosSeleccionados.forEach((obj: any) => {
        this.restU.EliminarCoordenadasUsuario(obj.id_emplu).subscribe(res => {
          this.ConsultarDatos();
        });
      })
      this.toastr.error('Registros removidos de la lista.', '', {
        timeOut: 6000,
      });
      this.HabilitarSeleccion();
      this.selectionUno.clear();
      EmpleadosSeleccionados = [];
    }
  }


  // FUNCION PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
  ConfirmarDeleteVarios() {
    this.ventana.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Remover();
        }
      });
  }

  // METODO PARA LISTAR COORDENADAS
  ListarCoordenadas() {
    this.componentec.ver_lista = true;
    this.componentec.ver_detalles = false;
    this.componentec.ObtenerCoordenadas();
  }

}
