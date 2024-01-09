import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

import { CiudadFeriadosService } from 'src/app/servicios/ciudadFeriados/ciudad-feriados.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';
import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service'

@Component({
  selector: 'app-editar-ciudad',
  templateUrl: './editar-ciudad.component.html',
  styleUrls: ['./editar-ciudad.component.css']
})

export class EditarCiudadComponent implements OnInit {

  // DATOS CIUDAD-FERIADO
  ciudadFeriados: any = [];
  nombreProvincias: any = [];

  actualizarPagina: boolean = false;

  // DATOS PROVINCIAS, CONTINENTES, PAÍSES Y CIUDADES
  nombreCiudades: any = [];
  continentes: any = [];
  provincias: any = [];
  paises: any = [];

  // BUSCAR ID
  idProv: any = [];
  idPais: any = [];
  idContin: any = [];

  // CONTROL DE LOS CAMPOS DEL FORMULARIO
  nombreContinenteF = new FormControl('', Validators.required);
  nombreCiudadF = new FormControl('', [Validators.required]);
  idProvinciaF = new FormControl('', [Validators.required]);
  nombrePaisF = new FormControl('', Validators.required);

  // ASIGNAR LOS CAMPOS EN UN FORMULARIO EN GRUPO
  public asignarCiudadForm = new FormGroup({
    nombreCiudadForm: this.nombreCiudadF,
    idProvinciaForm: this.idProvinciaF,
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
  });

  /**
   * VARIABLES PROGRESS SPINNER
   */
  habilitarprogress: boolean = false;
  value = 10;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(
    public restCiudad: CiudadService,
    private restF: CiudadFeriadosService,
    private restP: ProvinciaService,
    private toastr: ToastrService,
    private router: Router,
    public ventana: MatDialogRef<EditarCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.ObtenerContinentes();
    this.CargarDatos();
  }

  // METODO PARA MOSTRAR DATOS EN FORMULARIO
  CargarDatos() {
    // BUSCAR DATOS DE LA CIUDAD
    this.restCiudad.BuscarUnaCiudad(this.data.idciudad).subscribe(datosC => {
      this.idProv = datosC;
      //BUSCAR DATOS DE LA PROVINCIA
      this.restP.BuscarUnaProvinciaId(this.idProv[0].id_provincia).subscribe(datosP => {
        this.idPais = datosP;
        // CARGAR PROVINCIAS DEL PAIS ESTABLECIDO
        this.ObtenerProvincias(this.idPais[0].id_pais);
        // CARGAR CIUDADES DE LA PROVINCIA ESTABLECIDA
        this.ObtenerCiudades(this.idPais[0].nombre);
        // IMPRIMIR DATOS EN PANTALLA
        this.asignarCiudadForm.patchValue({
          idProvinciaForm: this.idPais[0].nombre,
        })
        // BUSCAR DATOS DEL PAIS
        this.restP.BuscarPaisId(this.idPais[0].id_pais).subscribe(datosC => {
          this.idContin = datosC;
          // CARGAR DATOS DEL PAIS ESTABLECIDO
          this.ObtenerPaises(this.idContin[0].continente);
          // MOSTRAR DATOS EN PANTALLA
          this.asignarCiudadForm.patchValue({
            nombreContinenteForm: this.idContin[0].continente,
            nombrePaisForm: this.idContin[0].id,
            nombreCiudadForm: this.data.idciudad,
          })
        })
      })
    })
  }

  // METODO PARA LISTAR CONTINENTES
  ObtenerContinentes() {
    this.continentes = [];
    this.restP.BuscarContinente().subscribe(datos => {
      this.continentes = datos;
    })
  }

  // METODO PARA BUSCAR PAISES
  ObtenerPaises(continente: any) {
    this.paises = [];
    this.restP.BuscarPais(continente).subscribe(datos => {
      this.paises = datos;
    })
  }

  // METODO PARA MOSTRAR LISTA DE PAISES
  FiltrarPaises(form: any) {
    var nombreContinente = form.nombreContinenteForm;
    this.ObtenerPaises(nombreContinente);
    this.LimpiarDatosContinente();
  }

  // METODO PARA BUSCAR PROVINCIAS
  ObtenerProvincias(pais: any) {
    this.provincias = [];
    this.restP.BuscarProvinciaPais(pais).subscribe(datos => {
      this.provincias = datos;
    }, error => {
      this.toastr.info('El País seleccionado no tiene Provincias, Departamentos o Estados registrados.', '', {
        timeOut: 6000,
      })
    })
  }

  // METODO PARA MOSTRAR LISTA DE PROVINCIAS
  FiltrarProvincias(form: any) {
    var nombrePais = form.nombrePaisForm;
    this.ObtenerProvincias(nombrePais);
    this.LimpiarDatosPais()
  }

  // METODO PARA BUSCAR CIUDADES
  ObtenerCiudades(provincia: any) {
    this.nombreCiudades = [];
    this.restF.BuscarCiudadProvincia(provincia).subscribe(datos => {
      this.nombreCiudades = datos;
    }, error => {
      this.toastr.info('Provincia, Departamento o Estado no tiene ciudades registradas.', '', {
        timeOut: 6000,
      })
    })
  }

  // METODO PARA MOSTRAR LISTA DE CIUDADES
  FiltrarCiudades(form: any) {
    var nombreProvincia = form.idProvinciaForm;
    this.ObtenerCiudades(nombreProvincia);
    this.LimpiarDatosProvincia();
  }

  // METODO PARA SELECCIONAR CIUDAD
  SeleccionarCiudad(form: any) {
    var nombreCiudad = form.nombreCiudadForm;
    if (nombreCiudad === undefined) {
      this.toastr.info('No ha seleccionado una CIUDAD.', '', {
        timeOut: 6000,
      })
    }
  }

  // METODO PARA LIMPIAR FORMULARIO
  LimpiarCampos() {
    this.asignarCiudadForm.reset();
    this.ObtenerContinentes();
    this.paises = [];
    this.provincias = [];
    this.nombreCiudades = [];
  }

  // METODO PARA LIMPIAR FORMULARIO CONTINENTE
  LimpiarDatosContinente() {
    this.paises = [];
    this.provincias = [];
    this.nombreCiudades = [];
    this.asignarCiudadForm.patchValue({
      nombreCiudadForm: '',
      idProvinciaForm: '',
      nombrePaisForm: '',
    })
  }

  // METODO PARA LIMPIAR FORMULARIO PAIS
  LimpiarDatosPais() {
    this.provincias = [];
    this.nombreCiudades = [];
    this.asignarCiudadForm.patchValue({
      nombreCiudadForm: '',
      idProvinciaForm: '',
    })
  }

  // METODO PARA LIMPIAR FORMULARIO PROVINCIAS
  LimpiarDatosProvincia() {
    this.nombreCiudades = [];
    this.asignarCiudadForm.patchValue({
      nombreCiudadForm: '',
    })
  }

  // METODO PARA CERRAR VENTANA DE REGISTRO
  CerrarVentana() {
    this.LimpiarCampos();
    this.ventana.close();
  }

  // METODO PARA ACTUALIZAR REGISTRO
  InsertarFeriadoCiudad(form: any) {
    this.habilitarprogress === true;
    var idFeriado = this.data.idferiado;
    var nombreCiudad = form.nombreCiudadForm;
    var ciudad = {
      id_feriado: idFeriado,
      id_ciudad: nombreCiudad,
      id: this.data.idciudad_asignada
    }
    this.ciudadFeriados = [];
    // VALIDAR EXISTENCIA DE REGISTRO
    this.restF.BuscarIdCiudad(ciudad).subscribe(datos => {
      this.habilitarprogress === false;
      this.ciudadFeriados = datos;
      this.toastr.info('Se le recuerda que esta Ciudad ya fue asignada a este Feriado.', '', {
        timeOut: 6000,
      })
    }, error => {
      // METODO PARA ACTUALIZAR DATOS
      this.restF.ActualizarDatos(ciudad).subscribe(response => {
        this.habilitarprogress === false;
        this.toastr.success('Operación exitosa.', 'Registro actualizado.', {
          timeOut: 6000,
        });
        this.CerrarVentana();
      }, error => {
        this.habilitarprogress === false;
        this.toastr.error('Ups!!! algo salio mal..', 'Ups!!! algo salio mal.', {
          timeOut: 6000,
        });
      });
    });
  }

}
