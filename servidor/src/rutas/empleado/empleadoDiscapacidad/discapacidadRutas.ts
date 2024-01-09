import { Router } from 'express';
import { TokenValidation } from '../../../libs/verificarToken';
import DISCAPACIDAD_CONTROLADOR from '../../../controlador/empleado/empleadoDiscapacidad/discapacidadControlador';

class DiscapacidadRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {

        // METODO PARA BUSCAR DATOS DISCAPACIDAD USUARIO
        this.router.get('/:id_empleado', TokenValidation, DISCAPACIDAD_CONTROLADOR.BuscarDiscapacidadUsuario);
        // METODO PARA REGISTRAR DISCAPACIDAD
        this.router.post('/', TokenValidation, DISCAPACIDAD_CONTROLADOR.RegistrarDiscapacidad);
        // METODO PARA ACTUALIZAR DATOS DISCAPACIDAD
        this.router.put('/:id_empleado', TokenValidation, DISCAPACIDAD_CONTROLADOR.ActualizarDiscapacidad);
        // METODO PARA ELIMINAR REGISTRO
        this.router.delete('/eliminar/:id_empleado', TokenValidation, DISCAPACIDAD_CONTROLADOR.EliminarDiscapacidad);


        /** *************************************************************************************** **
         ** **                METODO PARA MANEJO DE DATOS DE TIPO DISCAPACIDAD                   ** ** 
         ** *************************************************************************************** **/

        // METODO PARA REGISTRAR TIPO DE DISCAPACIDAD
        this.router.post('/buscarTipo', TokenValidation, DISCAPACIDAD_CONTROLADOR.RegistrarTipo);
        // METODO PARA BUSCAR LISTA DE TIPOS DE DISCAPACIDAD
        this.router.get('/buscarTipo/tipo', TokenValidation, DISCAPACIDAD_CONTROLADOR.ListarTipo);













        this.router.get('/', TokenValidation, DISCAPACIDAD_CONTROLADOR.list);



        // TIPO DISCAPACIDAD
        this.router.get('/buscarTipo/tipo/:id', TokenValidation, DISCAPACIDAD_CONTROLADOR.ObtenerUnTipoD);

        this.router.put('/buscarTipo/:id', TokenValidation, DISCAPACIDAD_CONTROLADOR.ActualizarTipoD);

    }
}

const DISCAPACIDAD_RUTAS = new DiscapacidadRutas();

export default DISCAPACIDAD_RUTAS.router;