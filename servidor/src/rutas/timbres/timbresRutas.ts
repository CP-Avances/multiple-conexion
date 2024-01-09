import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import TIMBRES_CONTROLADOR from '../../controlador/timbres/timbresControlador';

class TimbresRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {

        // METODO PARA ELIMINAR NOTIFICACIONES DE AVISOS  --**VERIFICADO
        this.router.put('/eliminar-multiples/avisos', TokenValidation, TIMBRES_CONTROLADOR.EliminarMultiplesAvisos);


        // METODO PARA BUSCAR TIMBRES (ASISTENCIA)
        this.router.post('/buscar/timbres-asistencia', TokenValidation, TIMBRES_CONTROLADOR.BuscarTimbresAsistencia);





        // METODO PARA BUSCAR MARCACIONES
        this.router.get('/', TokenValidation, TIMBRES_CONTROLADOR.ObtenerTimbres);
        // METODO PARA BUSCAR EL TIMBRE DE EMPLEADO POR FECHA
        this.router.get('/timbresfechaemple', TokenValidation, TIMBRES_CONTROLADOR.ObtenertimbreFechaEmple);
        // METODO PARA REGISTRAR TIMBRES PERSONALES
        this.router.post('/', TokenValidation, TIMBRES_CONTROLADOR.CrearTimbreWeb);
        // METODO PARA REGISTRAR TIMBRE ADMINISTRADOR
        this.router.post('/admin/', TokenValidation, TIMBRES_CONTROLADOR.CrearTimbreWebAdmin);
        // METODO PARA ACTUALIZAR EL TIMBRE DEL EMPLEADO
        this.router.put('/timbre/editar', TokenValidation, TIMBRES_CONTROLADOR.EditarTimbreEmpleadoFecha);










        // METODO DE BUSQUEDA DE AVISOS GENERALES
        this.router.get('/avisos-generales/:id_empleado', TokenValidation, TIMBRES_CONTROLADOR.ObtenerAvisosColaborador);

        // RUTA DE BUSQUEDA DE UNA NOTIFICACION ESPECIFICA
        this.router.get('/aviso-individual/:id', TokenValidation, TIMBRES_CONTROLADOR.ObtenerUnAviso);

        this.router.get('/noti-timbres/avisos/:id_empleado', TokenValidation, TIMBRES_CONTROLADOR.ObtenerAvisosTimbresEmpleado);
        this.router.put('/noti-timbres/vista/:id_noti_timbre', TokenValidation, TIMBRES_CONTROLADOR.ActualizarVista);




        this.router.get('/ver/timbres/:id', TokenValidation, TIMBRES_CONTROLADOR.ObtenerTimbresEmpleado);
        this.router.get('/ultimo-timbre', TokenValidation, TIMBRES_CONTROLADOR.ObtenerUltimoTimbreEmpleado);
    }
}

const TIMBRES_RUTAS = new TimbresRutas();

export default TIMBRES_RUTAS.router;