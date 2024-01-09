import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import * as moment from 'moment';
moment.locale('es');

import { LoginService } from '../../../servicios/login/login.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { ConexionDataBaseService } from 'src/app/servicios/conexionDataBase/conexion-data-base.service';

import { SocketService } from 'src/app/servicios/socketServices/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  intentos: number = 0;
  title = 'login';
  hide1 = true;
  url: string = '';

  // ALMACENAMIENTO DATOS USUARIO INGRESADO
  datosUsuarioIngresado: any = [];

  // VALIDACIONES DE CAMPOS DE FORMULARIO
  userMail = new FormControl('', Validators.required);
  pass = new FormControl('', Validators.required);

  public formulario = new FormGroup({
    usuarioF: this.userMail,
    passwordF: this.pass
  });

  isLoading = false;

  constructor(
    public rest: LoginService,
    public restU: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public conexionDataBase: ConexionDataBaseService,
    private socketConfigService: SocketService,
    ) {
    this.formulario.setValue({
      usuarioF: '',
      passwordF: ''
    });
  }

  latitud: number = -0.1918213;
  longitud: number = -78.4875258;

  private options = {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 15000
  };

  ngOnInit(): void {
    this.url = this.router.url;
    this.Geolocalizar();
  }

  // METODO QUE PERMITE ACCEDER A UBICACION DEL USUARIO
  Geolocalizar() {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (objPosition) => {
          this.latitud = objPosition.coords.latitude;
          this.longitud = objPosition.coords.longitude;
        }, (objPositionError) => {

          switch (objPositionError.code) {
            case objPositionError.PERMISSION_DENIED:
              // NO ES POSIBLE ACCEDER A LA POSICION DEL USUARIO
              break;
            case objPositionError.POSITION_UNAVAILABLE:
              // NO SE HA PODIDO ACCEDER A LA INFORMACIÓN DE SU POSICION
              break;
            case objPositionError.TIMEOUT:
              // EL SERVICIO HA TARDADO DEMASIADO TIEMPO EN RESPONDER
              break;
            default:
            // ERROR DESCONOCIDO
          }
        }, this.options);
    }
    else {
      // EL NAVEGADOR NO SOPORTA LA API DE GEOLOCALIZACION
    }
  }

  // MENSAJE DE ERROR AL INGRESAR INFORMACION
  ObtenerMensajeCampoUsuarioError() {
    if (this.userMail.hasError('required')) {
      return 'Ingresar nombre de usuario.';
    }
  }

  ObtenerMensajeCampoContraseniaError() {
    if (this.pass.hasError('required')) {
      return 'Ingresar su contraseña.';
    }
  }

  // VALIDACION DE INGRESO DE DATOS DE USUARIO - INTENTOS LIMITADOS
  ValidarUsuario(form: any) {
    var f = moment();
    if (form.usuarioF.trim().length === 0) return;
    if (form.passwordF.trim().length === 0) return;

    var local: boolean;
    this.intentos = this.intentos + 1;

    var hora = localStorage.getItem('time_wait');

    if (hora != undefined) {
      if (f.format('HH:mm:ss') > hora) {
        localStorage.removeItem('time_wait');
        this.intentos = 0;
        local = false;
      }
      else {
        local = true;
      }
    }
    else {
      local = false;
    }
    if (local === false) {
      this.IniciarSesion(form);
    }
    else {
      this.toastr.error('Intentelo más tarde.', 'Ha excedido el número de intentos.', {
        timeOut: 3000,
      });
    }
  }

  datosBase: any;
  // METODO PARA INICIAR SESION
  IniciarSesion(form: any) {
    // CIFRADO DE CONTRASEÑA
    const md5 = new Md5();
    let clave = md5.appendStr(form.passwordF).end();

    this.isLoading = true;

    let dataUsuario = {
      nombre_usuario: form.usuarioF,
      pass: clave,
    };

    if (this.latitud === undefined) {
      this.Geolocalizar();
      return this.toastr.error('Es necesario permitir el acceso a la ubicación del usuario.')
    }

    // VALIDACION A QUE BACKEND SE DEBE CONECTAR DE ACUERDO AL NOMBRE DE LA EMPRESA 
    const nombreData = 'fulltime4_prueba' //nombre de la tabla que esta en la base admin_fulltime del servidor1 es la primera conexion
    //Se envia el nombre de la tabla para optener el puerto y realizar las demas conexiones.
    this.conexionDataBase.ObtenerDataBase(nombreData).subscribe(res => {
      this.datosBase = res;
      console.log('data conectado: ',this.datosBase[0]);

      //Este localStorage almacena el puerto del servidor al que se va a conectar y este
      //permite que se concatene con la url en todos los servicios del programa
      localStorage.setItem('puerto', this.datosBase[0].puerto);
      //Se creo un servicio en el cual se cambia la url de socket donde se va a conectar
      //esto permite cambiar ya qu ese debe igual configurar una url por defecto para que no de error
      this.socketConfigService.setSocketUrl(localStorage.getItem('puerto'));

      //se implemento este timer que se vincula con el spinner para dar tiempo de configuracion de las variable
      //para que los servicios tome el valor del localStorage del puerto para realizar las conexiones al otro servidor.
      setTimeout(() => {
        console.log(this.socketConfigService.getSocketConfig());
        // VALIDACION DEL LOGIN
        this.rest.ValidarCredenciales(dataUsuario, localStorage.getItem('puerto')).subscribe(datos => {
          console.log('ver datos ', datos)
          this.isLoading = false;
          
          if (datos.message === 'error') {
            var f = moment();
            var espera = '00:01:00';
            if (this.intentos === 3) {
              var verificar = f.add(moment.duration(espera)).format('HH:mm:ss');
              localStorage.setItem('time_wait', verificar);
              this.toastr.error('Intentelo más tarde.', 'Ha exedido el número de intentos.', {
                timeOut: 3000,
              });
            }else {
              this.toastr.error('Usuario o contraseña no son correctos.', 'Ups!!! algo ha salido mal.', {
                timeOut: 6000,
              })
            }
            this.IngresoSistema(form.usuarioF, 'Fallido', datos.text);
          }
  
          else if (datos.message === 'error_') {
            this.toastr.error('Usuario no cumple con todos los requerimientos necesarios para acceder al sistema.', 'Oops!', {
              timeOut: 6000,
            })
          }
  
          else if (datos.message === 'inactivo') {
            this.toastr.error('Usuario no se encuentra activo en el sistema.', 'Oops!', {
              timeOut: 6000,
            })
          }
  
          else if (datos.message === 'licencia_expirada') {
            this.toastr.error('Licencia del sistema ha expirado.', 'Oops!', {
              timeOut: 6000,
            })
          }
  
          else if (datos.message === 'sin_permiso_acceso') {
            this.toastr.error('Usuario no tiene permisos de acceso al sistema.', 'Oops!', {
              timeOut: 6000,
            })
          }
  
          else if (datos.message === 'licencia_no_existe') {
            this.toastr.error('No se ha encontrado registro de licencia del sistema.', 'Oops!', {
              timeOut: 6000,
            })
          }
  
          else {
            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', datos.usuario);
            localStorage.setItem('rol', datos.rol);
            localStorage.setItem('empleado', datos.empleado);
            localStorage.setItem('empresa', datos.empresa);
            localStorage.setItem('sucursal', datos.sucursal);
            localStorage.setItem('departamento', datos.departamento);
            localStorage.setItem('ultimoCargo', datos.cargo);
            localStorage.setItem('ultimoContrato', datos.id_contrato);
            localStorage.setItem('autoriza', datos.estado);
            localStorage.setItem('bool_timbres', datos.acciones_timbres);
            localStorage.setItem('ip', datos.ip_adress);
            localStorage.setItem('fec_caducidad_licencia', datos.caducidad_licencia);
            this.toastr.success('Ingreso Existoso! ' + datos.usuario + ' ' + datos.ip_adress, 'Usuario y contraseña válidos', {
              timeOut: 6000,
            })
  
            if (datos.rol === 1) { // ADMIN
              if (!!localStorage.getItem("redireccionar")) {
                let redi = localStorage.getItem("redireccionar");
                this.router.navigate([redi], { relativeTo: this.route, skipLocationChange: false });
                  localStorage.removeItem("redireccionar");
              } else {
                this.router.navigate(['/home'])
              };
            }
            if (datos.rol === 2) { // EMPLEADO
              this.router.navigate(['/estadisticas']);
            }
            this.IngresoSistema(form.usuarioF, 'Exitoso', datos.ip_adress);
  
          }
  
        }, err => {
          this.toastr.error(err.error.message);
          this.isLoading = false;
        })

      }, 2500);

    },error => {
      console.log('error: ',error)
      this.toastr.error('No se ha encontrodo la empresa.','Advertencia');
      this.isLoading = false;
    })

    
  }

  // METODO PARA AUDITAR INICIOS DE SESION
  IngresoSistema(user: any, acceso: string, dir_ip: any) {
    var f = moment();
    var fecha = f.format('YYYY-MM-DD');
    var time = f.format('HH:mm:ss');
    let dataAcceso = {
      ip_address: dir_ip,
      user_name: user,
      modulo: 'login',
      acceso: acceso,
      fecha: fecha,
      hora: time,
    }
    this.restU.CrearAccesosSistema(dataAcceso).subscribe(datos => { })//se cambio la url en el servicio
  }

}
