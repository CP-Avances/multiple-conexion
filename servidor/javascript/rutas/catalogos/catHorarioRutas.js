"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verificarToken_1 = require("../../libs/verificarToken");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const catHorarioControlador_1 = __importDefault(require("../../controlador/catalogos/catHorarioControlador"));
const accesoCarpetas_1 = require("../../libs/accesoCarpetas");
const moment_1 = __importDefault(require("moment"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (0, accesoCarpetas_1.ObtenerRutaHorarios)());
    },
    filename: function (req, file, cb) {
        // FECHA DEL SISTEMA
        var fecha = (0, moment_1.default)();
        var anio = fecha.format('YYYY');
        var mes = fecha.format('MM');
        var dia = fecha.format('DD');
        let { id, codigo } = req.params;
        cb(null, id + '_' + codigo + '_' + anio + '_' + mes + '_' + dia + '_' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
    uploadDir: './plantillas',
});
class HorarioRutas {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        // REGISTRAR HORARIO
        this.router.post('/', verificarToken_1.TokenValidation, catHorarioControlador_1.default.CrearHorario);
        // BUSCAR HORARIO POR SU NOMBRE
        this.router.post('/buscar-horario/nombre', verificarToken_1.TokenValidation, catHorarioControlador_1.default.BuscarHorarioNombre);
        // CARGAR ARCHIVO DE RESPALDO  **//VERIFICADO
        this.router.put('/:id/documento/:archivo/verificar/:codigo', [verificarToken_1.TokenValidation, upload.single('uploads')], catHorarioControlador_1.default.GuardarDocumentoHorario);
        // ACTUALIZAR DATOS DE HORARIO
        this.router.put('/editar/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.EditarHorario);
        // ELIMINAR DOCUMENTO DE HORARIO BASE DE DATOS - SERVIDOR
        this.router.put('/eliminar_horario/base_servidor', [verificarToken_1.TokenValidation], catHorarioControlador_1.default.EliminarDocumento);
        // ELIMINAR DOCUMENTO DE HORARIOS DEL SERVIDOR
        this.router.put('/eliminar_horario/servidor', [verificarToken_1.TokenValidation], catHorarioControlador_1.default.EliminarDocumentoServidor);
        // BUSCAR LISTA DE CATALOGO HORARIOS   --**VERIFICADO
        this.router.get('/', verificarToken_1.TokenValidation, catHorarioControlador_1.default.ListarHorarios);
        // OBTENER VISTA DE DOCUMENTOS
        this.router.get('/documentos/:docs', catHorarioControlador_1.default.ObtenerDocumento);
        // BUSCAR HORARIOS SIN CONSIDERAR UNO EN ESPECIFICO (METODO DE EDICION)
        this.router.post('/buscar_horario/edicion', verificarToken_1.TokenValidation, catHorarioControlador_1.default.BuscarHorarioNombre_);
        // METODO PARA ELIMINAR REGISTRO
        this.router.delete('/eliminar/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.EliminarRegistros);
        // METODO PARA BUSCAR DATOS DE UN HORARIO
        this.router.get('/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.ObtenerUnHorario);
        // METODO PARA ACTUALIZAR HORAS TRABAJADAS
        this.router.put('/update-horas-trabaja/:id', verificarToken_1.TokenValidation, catHorarioControlador_1.default.EditarHorasTrabaja);
        // VERIFICAR DATOS DE LA PLANTILLA DE CATÁLOGO HORARIO Y LUEGO SUBIR AL SISTEMA
        this.router.post('/cargarHorario/verificarDatos/upload', [verificarToken_1.TokenValidation, multipartMiddleware], catHorarioControlador_1.default.VerificarDatos);
        this.router.post('/cargarHorario/verificarPlantilla/upload', [verificarToken_1.TokenValidation, multipartMiddleware], catHorarioControlador_1.default.VerificarPlantilla);
        this.router.post('/cargarHorario/upload', [verificarToken_1.TokenValidation, multipartMiddleware], catHorarioControlador_1.default.CargarHorarioPlantilla);
    }
}
const HORARIO_RUTAS = new HorarioRutas();
exports.default = HORARIO_RUTAS.router;
