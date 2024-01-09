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
exports.BuscarHora = exports.BuscarFecha = exports.FormatearHora = exports.FormatearFecha = exports.dia_completo = exports.dia_abreviado = exports.fechaHora = exports.enviarCorreos = exports.enviarMail = exports.Credenciales = exports.puerto = exports.servidor = exports.cabecera_firma = exports.pie_firma = exports.logo_ = exports.nombre = exports.email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es');
exports.email = process.env.EMAIL || '';
let pass = process.env.PASSWORD || '';
exports.nombre = process.env.NOMBRE || '';
exports.logo_ = process.env.LOGO || '';
exports.pie_firma = process.env.PIEF || '';
exports.cabecera_firma = process.env.CABECERA || '';
exports.servidor = process.env.SERVIDOR || '';
exports.puerto = process.env.PUERTO || '';
const Credenciales = function (id_empresa, correo = process.env.EMAIL, password = process.env.PASSWORD, empresa = process.env.NOMBRE, img = process.env.LOGO, img_pie = process.env.PIEF, img_cabecera = process.env.CABECERA, port = process.env.PUERTO, host = process.env.SERVIDOR) {
    return __awaiter(this, void 0, void 0, function* () {
        let credenciales = [];
        credenciales = yield DatosCorreo(id_empresa);
        return credenciales.message;
    });
};
exports.Credenciales = Credenciales;
function DatosCorreo(id_empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        let credenciales = yield database_1.default.query('SELECT correo, password_correo, nombre, logo, pie_firma, cabecera_firma, servidor, puerto ' +
            'FROM cg_empresa WHERE id = $1', [id_empresa])
            .then(result => {
            return result.rows;
        });
        console.log('correo... ', credenciales);
        if (credenciales.length === 0) {
            return { message: 'error' };
        }
        else {
            exports.email = credenciales[0].correo;
            pass = credenciales[0].password_correo;
            exports.nombre = credenciales[0].nombre;
            exports.logo_ = credenciales[0].logo;
            exports.pie_firma = credenciales[0].pie_firma;
            exports.cabecera_firma = credenciales[0].cabecera_firma;
            exports.servidor = credenciales[0].servidor;
            exports.puerto = credenciales[0].puerto;
            if (exports.cabecera_firma === null || exports.cabecera_firma === '') {
                exports.cabecera_firma = 'cabecera_firma.png';
            }
            if (exports.pie_firma === null || exports.pie_firma === '') {
                exports.pie_firma = 'pie_firma.png';
            }
            return { message: 'ok' };
        }
    });
}
const enviarMail = function (servidor, puerto) {
    var seguridad = false;
    if (puerto === 465) {
        seguridad = true;
    }
    else {
        seguridad = false;
    }
    const transporter = nodemailer_1.default.createTransport({
        //pool: true,
        host: servidor,
        port: puerto,
        secure: seguridad,
        auth: {
            user: exports.email,
            pass: pass
        },
    });
    return transporter;
};
exports.enviarMail = enviarMail;
const enviarCorreos = function (servidor, puerto, email, pass) {
    var seguridad = false;
    if (puerto === 465) {
        seguridad = true;
    }
    else {
        seguridad = false;
    }
    const transporter = nodemailer_1.default.createTransport({
        pool: true,
        //maxConnections: 2,
        maxMessages: Infinity,
        //rateLimit: 14, // 14 emails/second max
        //rateDelta: 1000,
        host: servidor,
        port: puerto,
        secure: seguridad,
        auth: {
            user: email,
            pass: pass
        },
    });
    return transporter;
};
exports.enviarCorreos = enviarCorreos;
const fechaHora = function () {
    var f = (0, moment_1.default)();
    var dia = moment_1.default.weekdays((0, moment_1.default)(f.format('YYYY-MM-DD')).day()).charAt(0).toUpperCase()
        + moment_1.default.weekdays((0, moment_1.default)(f.format('YYYY-MM-DD')).day()).slice(1);
    var tiempo = {
        fecha_formato: f.format('YYYY-MM-DD'),
        fecha: f.format('DD/MM/YYYY'),
        hora: f.format('HH:mm:ss'),
        dia: dia
    };
    return tiempo;
};
exports.fechaHora = fechaHora;
exports.dia_abreviado = 'ddd';
exports.dia_completo = 'dddd';
const FormatearFecha = function (fecha, dia) {
    return __awaiter(this, void 0, void 0, function* () {
        let formato = yield (0, exports.BuscarFecha)();
        let valor = (0, moment_1.default)(fecha).format(dia).charAt(0).toUpperCase() +
            (0, moment_1.default)(fecha).format(dia).slice(1) +
            ', ' + (0, moment_1.default)(fecha).format(formato.fecha);
        return valor;
    });
};
exports.FormatearFecha = FormatearFecha;
const FormatearHora = function (hora) {
    return __awaiter(this, void 0, void 0, function* () {
        let formato = yield (0, exports.BuscarHora)();
        let valor = (0, moment_1.default)(hora, 'HH:mm:ss').format(formato.hora);
        return valor;
    });
};
exports.FormatearHora = FormatearHora;
const BuscarFecha = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            fecha: yield database_1.default.query(`SELECT descripcion FROM detalle_tipo_parametro WHERE id_tipo_parametro = 25`).then(result => {
                if (result.rowCount != 0) {
                    return result.rows[0].descripcion;
                }
                else {
                    return 'DD/MM/YYYY';
                }
            })
        };
    });
};
exports.BuscarFecha = BuscarFecha;
const BuscarHora = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            hora: yield database_1.default.query(`SELECT descripcion FROM detalle_tipo_parametro WHERE id_tipo_parametro = 26`).then(result => {
                if (result.rowCount != 0) {
                    return result.rows[0].descripcion;
                }
                else {
                    return 'HH:mm:ss';
                }
            })
        };
    });
};
exports.BuscarHora = BuscarHora;
