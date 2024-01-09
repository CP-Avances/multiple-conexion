"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const documentosControlador_1 = __importDefault(require("../../controlador/documentos/documentosControlador"));
const accesoCarpetas_1 = require("../../libs/accesoCarpetas");
const verificarToken_1 = require("../../libs/verificarToken");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (0, accesoCarpetas_1.ObtenerRutaDocumento)());
    },
    filename: function (req, file, cb) {
        // FECHA DEL SISTEMA
        var fecha = (0, moment_1.default)();
        var anio = fecha.format('YYYY');
        var mes = fecha.format('MM');
        var dia = fecha.format('DD');
        let documento = anio + '_' + mes + '_' + dia + '_' + file.originalname;
        cb(null, documento);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
class DoumentosRutas {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        // METODO PARA REGISTRAR DOCUMENTOS   --**VERIFICADO
        this.router.post('/registrar/:doc_nombre', verificarToken_1.TokenValidation, upload.single('uploads'), documentosControlador_1.default.CrearDocumento);
        // METODO PARA LISTAR CARPETAS
        this.router.get('/carpetas/', documentosControlador_1.default.Carpetas);
        // METODO PARA LISTAR ARCHIVOS DE CARPETAS
        this.router.get('/lista-carpetas/:nom_carpeta', documentosControlador_1.default.ListarArchivosCarpeta);
        // METODO PARA LISTAR DOCUMENTOS DE DOCUMENTACION  --**VERIFICADO
        this.router.get('/documentacion/:nom_carpeta', documentosControlador_1.default.ListarCarpetaDocumentos);
        // METODO PARA LISTAR DOCUMENTOS DE CONTRATOS
        this.router.get('/lista-contratos/:nom_carpeta', documentosControlador_1.default.ListarCarpetaContratos);
        // METODO PARA LISTAR DOCUMENTOS DE PERMISOS
        this.router.get('/lista-permisos/:nom_carpeta', documentosControlador_1.default.ListarCarpetaPermisos);
        // METODO PARA LISTAR ARCHIVOS DE PERMISOS
        this.router.get('/lista-archivos-individuales/:nom_carpeta/tipo/:tipo', documentosControlador_1.default.ListarArchivosIndividuales);
        // METODO PARA LISTAR DOCUMENTOS DE HORARIOS
        this.router.get('/lista-horarios/:nom_carpeta', documentosControlador_1.default.ListarCarpetaHorarios);
        // METODO PARA DESCARGAR ARCHIVOS
        this.router.get('/download/files/:nom_carpeta/:filename', documentosControlador_1.default.DownLoadFile);
        // METODO PARA DESCARGAR ARCHIVOS INDIVIDUALES
        this.router.get('/download/files/:nom_carpeta/:filename/tipo/:tipo', documentosControlador_1.default.DescargarArchivos);
        // METODO PARA ELIMINAR ARCHIVOS
        this.router.delete('/eliminar/:id/:documento', verificarToken_1.TokenValidation, documentosControlador_1.default.EliminarRegistros);
    }
}
const DOCUMENTOS_RUTAS = new DoumentosRutas();
exports.default = DOCUMENTOS_RUTAS.router;
