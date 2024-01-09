"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contratoEmpleadoControlador_1 = __importDefault(require("../../../controlador/empleado/empleadoContrato/contratoEmpleadoControlador"));
const accesoCarpetas_1 = require("../../../libs/accesoCarpetas");
const verificarToken_1 = require("../../../libs/verificarToken");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const database_1 = __importDefault(require("../../../database"));
const moment_1 = __importDefault(require("moment"));
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './contratos',
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            const usuario = yield database_1.default.query(`
            SELECT e.id FROM empleados AS e, empl_contratos AS c WHERE c.id = $1 AND c.id_empleado = e.id
            `, [id]);
            var ruta = yield (0, accesoCarpetas_1.ObtenerRutaContrato)(usuario.rows[0].id);
            cb(null, ruta);
        });
    },
    filename: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            // FECHA DEL SISTEMA
            var fecha = (0, moment_1.default)();
            var anio = fecha.format('YYYY');
            var mes = fecha.format('MM');
            var dia = fecha.format('DD');
            // DATOS DOCUMENTO
            let id = req.params.id;
            const usuario = yield database_1.default.query(`
            SELECT codigo FROM empleados AS e, empl_contratos AS c WHERE c.id = $1 AND c.id_empleado = e.id
            `, [id]);
            let documento = usuario.rows[0].codigo + '_' + anio + '_' + mes + '_' + dia + '_' + file.originalname;
            cb(null, documento);
        });
    }
});
const upload = (0, multer_1.default)({ storage: storage });
class DepartamentoRutas {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        /** ******************************************************************************************** **
         ** **                      MANEJO DE DATOS DE CONTRATO DEL USUARIO                           ** **
         ** ******************************************************************************************** **/
        // REGISTRAR DATOS DE CONTRATO
        this.router.post('/', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.CrearContrato);
        // GUARDAR DOCUMENTO 
        this.router.put('/:id/documento-contrato', [verificarToken_1.TokenValidation, upload.single('uploads')], contratoEmpleadoControlador_1.default.GuardarDocumentoContrato);
        // MOSTRAR DOCUMENTO CARGADO EN EL SISTEMA
        this.router.get('/documentos/:docs/contrato/:id', contratoEmpleadoControlador_1.default.ObtenerDocumento);
        // METODO PARA BUSCAR CONTRATOS POR ID DE EMPLEADO
        this.router.get('/contrato-empleado/:id_empleado', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.BuscarContratoEmpleado);
        // EDITAR DATOS DE CONTRATO
        this.router.put('/:id/actualizar', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EditarContrato);
        // ELIMINAR DOCUMENTO DE CONTRATO BASE DE DATOS - SERVIDOR
        this.router.put('/eliminar_contrato/base_servidor', [verificarToken_1.TokenValidation], contratoEmpleadoControlador_1.default.EliminarDocumento);
        // ELIMINAR DOCUMENTO DE CONTRATOS DEL SERVIDOR
        this.router.put('/eliminar_contrato/servidor', [verificarToken_1.TokenValidation], contratoEmpleadoControlador_1.default.EliminarDocumentoServidor);
        // METODO PARA BUSCAR ID ACTUAL DE CONTRATO
        this.router.get('/contratoActual/:id_empleado', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EncontrarIdContratoActual);
        // METODO PARA BUSCAR DATOS DE CONTRATO POR ID
        this.router.get('/contrato/:id', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EncontrarDatosUltimoContrato);
        // METODO PARA BUSCAR FECHAS DE CONTRATOS    --**VERIFICADO
        this.router.post('/buscarFecha', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EncontrarFechaContrato);
        /** ********************************************************************************************* **
         ** **            METODOS PARA SER USADOS EN LA TABLA MODAL_TRABAJO O TIPO DE CONTRATOS        ** **
         ** ********************************************************************************************* **/
        // REGISTRAR MODALIDAD DE TRABAJO
        this.router.post('/modalidad/trabajo', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.CrearTipoContrato);
        // BUSCAR LISTA DE MODALIDAD DE TRABAJO
        this.router.get('/modalidad/trabajo', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.ListarTiposContratos);
        this.router.get('/', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.ListarContratos);
        this.router.get('/:id/get', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.ObtenerUnContrato);
        this.router.get('/:id_empleado', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EncontrarIdContrato);
        this.router.post('/buscarFecha/contrato', verificarToken_1.TokenValidation, contratoEmpleadoControlador_1.default.EncontrarFechaContratoId);
    }
}
const CONTRATO_EMPLEADO_RUTAS = new DepartamentoRutas();
exports.default = CONTRATO_EMPLEADO_RUTAS.router;
