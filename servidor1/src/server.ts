require('dotenv').config();
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// rutas importadas
import indexRutas from './rutas/indexRutas';
import LICENCIAS_RUTAS from './utils/licencias';
import RELOJ_VIRTUAL_RUTAS from './utils/reloj_virtual';
import CONEXION_DATABASES_RUTAS from './rutas/conexionDataBases/conexionDataBasesRutas';

import { createServer, Server } from 'http';

var io: any;


class Servidor {

    public app: Application;
    public server: Server;

    constructor() {
        this.app = express();
        this.configuracion();
        this.rutas();
        //this.server = require("http").createServer(this.app);
        this.server = createServer(this.app);
        this.app.use(cors());
        io = require('socket.io')(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });
        
    }
    configuracion(): void {
        this.app.set('puerto', process.env.PORT || 3001);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        //this.app.use(express.json());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(express.raw({ type: 'image/*', limit: '2Mb' }));
        this.app.set('trust proxy', true);
        this.app.get('/', (req, res) => {
            res.status(200).json({
                status: 'success'
            });
        });
    }

    rutas(): void {
        this.app.use('/', indexRutas);

        // CONEXION DATA BASE
        this.app.use('/conexionDataBases', CONEXION_DATABASES_RUTAS);

        // LICENCIAS
        this.app.use('/licencias', LICENCIAS_RUTAS);

        // APP RELOJ VIRTUAL
        this.app.use('/reloj-virtual', RELOJ_VIRTUAL_RUTAS);

    }

    start(): void {

        this.server.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });

        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        })
        io.on('connection', (socket: any) => {
            console.log('Connected client on port %s.', this.app.get('puerto'));

            socket.on("nueva_notificacion", (data: any) => {
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
                }
                console.log('server', data_llega);
                socket.broadcast.emit('recibir_notificacion', data_llega);
                socket.emit('recibir_notificacion', data_llega);
            });

            socket.on("nuevo_aviso", (data: any) => {
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
                }
                console.log('server aviso .......', data_llega);
                socket.broadcast.emit('recibir_aviso', data_llega);
                socket.emit('recibir_aviso', data_llega);
            });
        });

    }
}

const SERVIDOR = new Servidor();
SERVIDOR.start();