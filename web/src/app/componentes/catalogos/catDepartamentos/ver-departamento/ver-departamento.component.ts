import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { AutorizaDepartamentoService } from 'src/app/servicios/autorizaDepartamento/autoriza-departamento.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';

import { RegistrarNivelDepartamentoComponent } from 'src/app/componentes/catalogos/catDepartamentos/registro-nivel-departamento/registrar-nivel-departamento.component';
import { PrincipalDepartamentoComponent } from '../listar-departamento/principal-departamento.component';
import { VerSucursalComponent } from '../../catSucursal/ver-sucursal/ver-sucursal.component';
import { MetodosComponent } from 'src/app/componentes/administracionGeneral/metodoEliminar/metodos.component';

interface Nivel {
  valor: number;
  nombre: string
}

@Component({
  selector: 'app-ver-departamento',
  templateUrl: './ver-departamento.component.html',
  styleUrls: ['./ver-departamento.component.css']
})

export class VerDepartamentoComponent implements OnInit {

  @Input() id_departamento: number;
  @Input() pagina: string;

  // CONTROL DE LOS CAMPOS DEL FORMULARIO
  idSucursal = new FormControl('');
  depaPadre = new FormControl('');
  nombre = new FormControl('', Validators.required);
  nivel = new FormControl('', Validators.required);

  // DATOS DEPARTAMENTO
  sucursales: any = [];
  departamentos: any = [];
  Habilitar: boolean = false;

  // ITEMS DE PAGINACION DE LA TABLA
  tamanio_pagina: number = 6;
  numero_pagina: number = 1;
  pageSizeOptions = [6, 10, 20, 50];

  // ASIGNAR LOS CAMPOS EN UN FORMULARIO EN GRUPO
  public formulario = new FormGroup({
    nivelForm: this.nivel,
    nombreForm: this.nombre,
    depaPadreForm: this.depaPadre,
    idSucursalForm: this.idSucursal,
  });

  // ARREGLO DE NIVELES EXISTENTES
  niveles: Nivel[] = [
    { valor: 1, nombre: '1' },
    { valor: 2, nombre: '2' },
    { valor: 3, nombre: '3' },
    { valor: 4, nombre: '4' },
    { valor: 5, nombre: '5' }
  ];

  /**
   * VARIABLES PROGRESS SPINNER
   */
  habilitarprogress: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;

  info: any = [];
  nombre_sucursal: string = '';
  mostrar: boolean = true;

  constructor(
    public componented: PrincipalDepartamentoComponent,
    public componentes: VerSucursalComponent,
    public ventana: MatDialog,
    public router: Router,
    public auto: AutorizaDepartamentoService,
    public rest: DepartamentosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.id_departamento) {
      this.rest.BuscarDepartamento(this.id_departamento).subscribe(dato => {
        this.info = dato[0];
        this.nombre_sucursal = this.info.sucursal.toUpperCase();
        this.CargarDatos(this.info);
      })
    }
  }

  // METODO PARA IMPRIMIR DATOS EN FORMULARIO
  CargarDatos(info: any) {
    this.departamentos = [];
    var id_departamento = info.id;
    var id_establecimiento = info.id_sucursal;
    this.rest.ConsultarNivelDepartamento(id_departamento, id_establecimiento).subscribe(datos => {
      this.departamentos = datos;
      console.log('ver data de departamentos ', this.departamentos)
    }, error => {
      this.toastr.warning('No se encontraron niveles de aprobación registrados.', '', {
        timeOut: 1000,
      });
    })
  }

  // METODO PARA BUSCAR DEPARTAMENTOS
  ListaDepartamentos() {
    this.departamentos = []
    this.rest.ConsultarDepartamentos().subscribe(datos => {
      this.departamentos = datos;
      this.OrdenarDatos(this.departamentos);
    })
  }

  // CONTROL DE PAGINACION
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  // FUNCION PARA ELIMINAR REGISTRO SELECCIONADO
  Eliminar(id_dep: number, datos: any) {
    this.rest.EliminarRegistroNivelDepa(id_dep).subscribe(res => {
      this.ActualizarRegistros(datos);
    });
  }

// METODO PARA ACTUALIZAR NIVELES DE APROBACION
  ActualizarRegistros(datos: any) {
    var data = { nivel: 0 };
    var arreglo: any = [];
    var contador = 0;
    var actualiza = 0;
    arreglo = this.departamentos;
    arreglo.forEach(item => {
      contador = contador + 1;
      if (datos.nivel < item.nivel) {
        data.nivel = item.nivel - 1;
        item.nivel = data.nivel;
        this.rest.ActualizarNivelDepa(item.id, data).subscribe(res => {
          actualiza = actualiza + 1;
          if (res.message === 'error') {
            if (actualiza === arreglo.length) {
              this.toastr.error('No se logro actualizar la tabla niveles de autorizacion. Revisar la configuración.',
                'Ups!!! algo salio mal.', {
                timeOut: 1000,
              });
              this.CargarDatos(this.info);
            }
          }
          else {
            if (actualiza === arreglo.length) {
              this.CargarDatos(this.info);
            }
          }
        })
      }
      else {
        this.CargarDatos(this.info);
      }
    });
    if (contador === arreglo.length) {
      this.CargarDatos(this.info);
      this.CargarDatos(this.info);
      this.toastr.error('Registro eliminado.', '', {
        timeOut: 1000,
      });
    }
  }

  // FUNCION PARA CONFIRMAR SI SE ELIMINA O NO UN REGISTRO 
  ConfirmarDelete(datos: any) {
    this.ventana.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.Eliminar(datos.id, datos);
        }
      });
  }

  // ORDENAR LOS DATOS SEGUN EL ID 
  OrdenarDatos(array: any) {
    function compare(a: any, b: any) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    }
    array.sort(compare);
  }

  // METODO PARA REGISTRAR NIVEL DE AUTORIZACION
  AbrirRegistrarNiveles() {
    this.ventana.open(RegistrarNivelDepartamentoComponent,
      { width: '500px', data: this.info }).afterClosed()
      .subscribe(() => {
        this.CargarDatos(this.info);
      }
      );
  }

  // METODO PARA VISUALIZAR LISTA DE USUARIOS QUE AUTORIZAN
  empleados: any = [];
  depa: string;
  AbrirVentanaVerListadoEmpleados(departamento: any) {
    this.habilitarprogress = true;
    var id_depa = departamento.id_dep_nivel;
    this.depa = departamento.dep_nivel_nombre;
    this.auto.BuscarListaEmpleadosAutorizan(id_depa).subscribe(datos => {
      this.empleados = datos;
      this.habilitarprogress = false;
      this.mostrar = false;
    }, error => {
      this.mostrar = true;
      this.habilitarprogress = false;
      this.toastr.error('No se ha encontrado usuarios que autoricen en este departamento.', '', {
        timeOut: 4000,
      });
    })
  }

  // METODO PARA CERRAR TABLA DE USUARIOS AUTORIZA
  CerrarTabla() {
    this.mostrar = true;
  }

  // METODO PARA VER PANTALLAS
  VerDepartamentos() {
    if (this.pagina === 'ver-departamento') {
      this.componented.ver_nivel = false;
      this.componented.ver_departamentos = true;
      this.componented.ListaDepartamentos();
    }
    else {
      this.componentes.ver_nivel = false;
      this.componentes.ver_sucursal = true;
      this.componentes.ListaDepartamentos();
    }
  }

}
