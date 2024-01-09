import { Router } from 'express';
import { TokenValidation } from '../../libs/verificarToken'
import PLAN_GENERAL_CONTROLADOR from '../../controlador/planGeneral/planGeneralControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        // METODO PARA REGISTRAR PLAN GENERAL  --**VERIFICADO
        this.router.post('/', TokenValidation, PLAN_GENERAL_CONTROLADOR.CrearPlanificacion);
        // METOOD PARA BUSCAR ID POR FECHAS PLAN GENERAL   --**VERIFICADO
        this.router.post('/buscar_fechas', TokenValidation, PLAN_GENERAL_CONTROLADOR.BuscarFechas);
        // METODO PARA ELIMINAR REGISTROS   --**VERIFICADO
        this.router.post('/eliminar', TokenValidation, PLAN_GENERAL_CONTROLADOR.EliminarRegistros);
        // METODO PARA BUSCAR HORARIO DE UN USUARIO POR FECHAS
        this.router.post('/horario-general-fechas', TokenValidation, PLAN_GENERAL_CONTROLADOR.BuscarHorarioFechas);
        // METODO PARA LISTAR PLANIFICACION DE USUARIOS  --**VERIFICADO
        this.router.post('/horario-general-planificacion', TokenValidation, PLAN_GENERAL_CONTROLADOR.ListarPlanificacionHoraria);
        // METODO PARA LISTAR DETALLE DE HORARIOS DE LOS USUARIOS  --**VERIFICADO
        this.router.post('/horario-general-detalle', TokenValidation, PLAN_GENERAL_CONTROLADOR.ListarDetalleHorarios);
        // METODO PARA LISTAR SOLO HORARIOS DE USUARIOS  --**VERIFICADO
        this.router.post('/horario-solo-planificacion/lista', TokenValidation, PLAN_GENERAL_CONTROLADOR.ListarHorariosUsuario);
        // METODO PARA LISTAR SOLO HORARIOS DE DESCANSO DE USUARIOS  --**VERIFICADO
        this.router.post('/horario-solo-planificacion/lista-descanso', TokenValidation, PLAN_GENERAL_CONTROLADOR.ListarHorariosDescanso);
        // METODO PARA BUSCAR ASISTENCIA
        this.router.post('/buscar-asistencia', TokenValidation, PLAN_GENERAL_CONTROLADOR.BuscarAsistencia);
        // METODO PARA ACTUALIZAR ASISTENCIA MANUAL
        this.router.post('/actualizar-asistencia/manual', TokenValidation, PLAN_GENERAL_CONTROLADOR.ActualizarManual);


        this.router.post('/buscar_fecha/plan', TokenValidation, PLAN_GENERAL_CONTROLADOR.BuscarFecha);
    }
}

const PLAN_GENERAL_RUTAS = new DepartamentoRutas();

export default PLAN_GENERAL_RUTAS.router;