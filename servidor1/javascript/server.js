"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// rutas importadas
const indexRutas_1 = __importDefault(require("./rutas/indexRutas"));
const licencias_1 = __importDefault(require("./utils/licencias"));
const reloj_virtual_1 = __importDefault(require("./utils/reloj_virtual"));
const conexionDataBasesRutas_1 = __importDefault(require("./rutas/conexionDataBases/conexionDataBasesRutas"));
const http_1 = require("http");
var io;
class Servidor {
    constructor() {
        this.app = (0, express_1.default)();
        this.configuracion();
        this.rutas();
        //this.server = require("http").createServer(this.app);
        this.server = (0, http_1.createServer)(this.app);
        this.app.use((0, cors_1.default)());
        io = require('socket.io')(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });
    }
    configuracion() {
        this.app.set('puerto', process.env.PORT || 3001);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        //this.app.use(express.json());
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(express_1.default.raw({ type: 'image/*', limit: '2Mb' }));
        this.app.set('trust proxy', true);
        this.app.get('/', (req, res) => {
            res.status(200).json({
                status: 'success'
            });
        });
    }
    rutas() {
        this.app.use('/', indexRutas_1.default);
        // CONEXION DATA BASE
        this.app.use('/conexionDataBases', conexionDataBasesRutas_1.default);
        // LICENCIAS
        this.app.use('/licencias', licencias_1.default);
        // APP RELOJ VIRTUAL
        this.app.use('/reloj-virtual', reloj_virtual_1.default);
    }
    start() {
        this.server.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });
        io.on('connection', (socket) => {
            console.log('Connected client on port %s.', this.app.get('puerto'));
            socket.on("nueva_notificacion", (data) => {
                let data_llega = {
                    id: data.id,
                    id_send_empl: data.id_send_empl,
                    id_receives_empl: data.id_receives_empl,
                    id_receives_depa: data.id_receives_depa,
                    estado: data.estado,
                    create_at: data.create_at,
                    id_permiso: data.id_permiso,
                    id_vacaciones: data.id_vacaciones,
                    id_hora_extra: data.id_hora_extra,
                    mensaje: data.mensaje,
                    tipo: data.tipo,
                    usuario: data.usuario
                };
                console.log('server', data_llega);
                socket.broadcast.emit('recibir_notificacion', data_llega);
                socket.emit('recibir_notificacion', data_llega);
            });
            socket.on("nuevo_aviso", (data) => {
                let data_llega = {
                    id: data.id,
                    create_at: data.create_at,
                    id_send_empl: data.id_send_empl,
                    id_receives_empl: data.id_receives_empl,
                    visto: data.visto,
                    descripcion: data.descripcion,
                    id_timbre: data.id_timbre,
                    tipo: data.tipo,
                    usuario: data.usuario
                };
                console.log('server aviso .......', data_llega);
                socket.broadcast.emit('recibir_aviso', data_llega);
                socket.emit('recibir_aviso', data_llega);
            });
        });
    }
}
const SERVIDOR = new Servidor();
SERVIDOR.start();
