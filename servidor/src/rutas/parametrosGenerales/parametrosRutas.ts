import { Router } from 'express';
import PARAMETROS_CONTROLADOR from '../../controlador/parametrosGenerales/parametrosControlador';
import { TokenValidation } from '../../libs/verificarToken'

class ParametrosRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        // BUSCAR LISTA DE PARAMETROS
        this.router.get('/', TokenValidation, PARAMETROS_CONTROLADOR.ListarParametros);
        // METODO PARA ELIMINAR PARAMETRO
        this.router.delete('/eliminar-tipo/:id', TokenValidation, PARAMETROS_CONTROLADOR.EliminarTipoParametro);
        // METODO PARA ACTUALIZAR PARAMETRO
        this.router.put('/actual-tipo', TokenValidation, PARAMETROS_CONTROLADOR.ActualizarTipoParametro);
        // METODO PARA VER DATOS DE UN PARAMETRO
        this.router.get('/ver-parametro/:id', TokenValidation, PARAMETROS_CONTROLADOR.ListarUnParametro);
        // METODO PARA BUSCAR DETALLES DE PARAMETRO
        this.router.get('/:id', TokenValidation, PARAMETROS_CONTROLADOR.VerDetalleParametro);
        // METODO PARA ELIMINAR DETALLE DE PARAMETRO
        this.router.delete('/eliminar-detalle/:id', TokenValidation, PARAMETROS_CONTROLADOR.EliminarDetalleParametro);
        // METODO PARA REGISTRAR DETALLE DE PARAMETRO
        this.router.post('/detalle', TokenValidation, PARAMETROS_CONTROLADOR.IngresarDetalleParametro);
        // METODO PARA ACTUALIZAR DETALLE DE PARAMETRO
        this.router.put('/actual-detalle', TokenValidation, PARAMETROS_CONTROLADOR.ActualizarDetalleParametro);
        // METODO PARA REGISTRAR PARAMETRO
        this.router.post('/tipo', TokenValidation, PARAMETROS_CONTROLADOR.IngresarTipoParametro);
        // METODO PARA COMPARAR COORDENADAS
        this.router.post('/coordenadas', TokenValidation, PARAMETROS_CONTROLADOR.CompararCoordenadas);

    }
}

const PARAMETROS_RUTAS = new ParametrosRutas();

export default PARAMETROS_RUTAS.router;