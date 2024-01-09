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
// IMPORTAR LIBRERIAS
const settingsMail_1 = require("../../libs/settingsMail");
const database_1 = __importDefault(require("../../database"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
class LoginControlador {
    // METODO PARA VALIDAR DATOS DE ACCESO AL SISTEMA
    ValidarCredenciales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // VARIABLE USADO PARA BUSQUEDA DE LICENCIA
            let caducidad_licencia = new Date();
            // OBTENCION DE DIRECCION IP
            var requestIp = require('request-ip');
            var clientIp = requestIp.getClientIp(req);
            if (clientIp != null && clientIp != '' && clientIp != undefined) {
                var ip_cliente = clientIp.split(':')[3];
            }
            try {
                const { nombre_usuario, pass } = req.body;
                // BUSQUEDA DE USUARIO
                const USUARIO = yield database_1.default.query(`
        SELECT id, usuario, id_rol, id_empleado FROM accesoUsuarios($1, $2)
        `, [nombre_usuario, pass]);
                // SI EXISTE USUARIOS
                if (USUARIO.rowCount != 0) {
                    //console.log('usuario existe')
                    const { id, id_empleado, id_rol, usuario: user } = USUARIO.rows[0];
                    let ACTIVO = yield database_1.default.query(`
          SELECT e.estado AS empleado, u.estado AS usuario, e.codigo, e.web_access 
          FROM empleados AS e, usuarios AS u WHERE e.id = u.id_empleado AND u.id = $1
          `, [USUARIO.rows[0].id])
                        .then((result) => {
                        return result.rows;
                    });
                    const { empleado, usuario, codigo, web_access } = ACTIVO[0];
                    //console.log('estado del usuario ', empleado, ' ', usuario)
                    // SI EL USUARIO NO SE ENCUENTRA ACTIVO
                    if (empleado === 2 && usuario === false) {
                        return res.jsonp({ message: 'inactivo' });
                    }
                    // SI LOS USUARIOS NO TIENEN PERMISO DE ACCESO
                    if (!web_access)
                        return res.status(404).jsonp({ message: "sin_permiso_acceso" });
                    // BUSQUEDA DE MODULOS DEL SISTEMA
                    const [modulos] = yield database_1.default.query(`
          SELECT * FROM funciones LIMIT 1
          `).then((result) => { return result.rows; });
                    // BUSQUEDA DE CLAVE DE LICENCIA
                    const EMPRESA = yield database_1.default.query(`
          SELECT public_key, id AS id_empresa FROM cg_empresa
          `);
                    const { public_key, id_empresa } = EMPRESA.rows[0];
                    // BUSQUEDA DE LICENCIA DE USO DE APLICACION
                    const data = fs_1.default.readFileSync('licencia.conf.json', 'utf8');
                    const FileLicencias = JSON.parse(data);
                    const ok_licencias = FileLicencias.filter((o) => {
                        return o.public_key === public_key;
                    }).map((o) => {
                        o.fec_activacion = new Date(o.fec_activacion),
                            o.fec_desactivacion = new Date(o.fec_desactivacion);
                        return o;
                    });
                    if (ok_licencias.length === 0)
                        return res.status(404)
                            .jsonp({ message: 'licencia_no_existe' });
                    const hoy = new Date();
                    const { fec_activacion, fec_desactivacion } = ok_licencias[0];
                    if (hoy > fec_desactivacion)
                        return res.status(404).jsonp({ message: 'licencia_expirada' });
                    if (hoy < fec_activacion)
                        return res.status(404).jsonp({ message: 'licencia_expirada' });
                    caducidad_licencia = fec_desactivacion;
                    // BUSQUEDA DE INFORMACION
                    const INFORMACION = yield database_1.default.query(`
              SELECT e.id as id_contrato, c.hora_trabaja, c.id_departamento, c.id_sucursal, s.id_empresa, 
                c.id AS id_cargo, cg_e.acciones_timbres, cg_e.public_key, 
                (SELECT id FROM peri_vacaciones pv WHERE pv.codigo = empl.codigo 
                  ORDER BY pv.fec_inicio DESC LIMIT 1 ) as id_peri_vacacion, 
                (SELECT nombre FROM cg_departamentos cd WHERE cd.id = c.id_departamento ) AS ndepartamento 
              FROM empl_contratos AS e, empl_cargos AS c, sucursales AS s, cg_empresa AS cg_e, 
                empleados AS empl 
              WHERE e.id_empleado = $1 AND e.id_empleado = empl.id AND 
                (SELECT id_contrato FROM datos_actuales_empleado WHERE id = e.id_empleado) = e.id AND 
                (SELECT id_cargo FROM datos_actuales_empleado WHERE id = e.id_empleado) = c.id AND 
                c.id_sucursal = s.id AND s.id_empresa = cg_e.id ORDER BY c.fec_inicio DESC LIMIT 1
            `, [USUARIO.rows[0].id_empleado]);
                    // VALIDACION DE ACCESO CON LICENCIA 
                    if (INFORMACION.rowCount > 0) {
                        console.log('ingresa a validacion de licencia');
                        try {
                            const { id_contrato, id_cargo, id_departamento, acciones_timbres, id_sucursal, id_empresa, public_key: licencia } = INFORMACION.rows[0];
                            const AUTORIZA = yield database_1.default.query(`
              SELECT estado FROM depa_autorizaciones
              WHERE id_empl_cargo = $1 AND id_departamento = $2
              `, [id_cargo, id_departamento]);
                            if (AUTORIZA.rowCount > 0) {
                                const { estado: autoriza_est } = AUTORIZA.rows[0];
                                const token = jsonwebtoken_1.default.sign({
                                    _licencia: licencia, codigo: codigo, _id: id, _id_empleado: id_empleado, rol: id_rol,
                                    _dep: id_departamento, _web_access: web_access, _acc_tim: acciones_timbres, _suc: id_sucursal,
                                    _empresa: id_empresa, estado: autoriza_est, cargo: id_cargo, ip_adress: ip_cliente,
                                    modulos: modulos, id_contrato: id_contrato
                                }, process.env.TOKEN_SECRET || 'llaveSecreta', { expiresIn: 60 * 60 * 23, algorithm: 'HS512' });
                                return res.status(200).jsonp({
                                    caducidad_licencia, token, usuario: user, rol: id_rol, empleado: id_empleado,
                                    departamento: id_departamento, acciones_timbres: acciones_timbres, sucursal: id_sucursal,
                                    empresa: id_empresa, cargo: id_cargo, estado: autoriza_est, ip_adress: ip_cliente,
                                    modulos: modulos, id_contrato: id_contrato
                                });
                            }
                            else {
                                const token = jsonwebtoken_1.default.sign({
                                    _licencia: licencia, codigo: codigo, _id: id, _id_empleado: id_empleado, rol: id_rol,
                                    _dep: id_departamento, _web_access: web_access, _acc_tim: acciones_timbres, _suc: id_sucursal,
                                    _empresa: id_empresa, estado: false, cargo: id_cargo, ip_adress: ip_cliente, modulos: modulos,
                                    id_contrato: id_contrato
                                }, process.env.TOKEN_SECRET || 'llaveSecreta', { expiresIn: 60 * 60 * 23, algorithm: 'HS512' });
                                return res.status(200).jsonp({
                                    caducidad_licencia, token, usuario: user, rol: id_rol, empleado: id_empleado,
                                    departamento: id_departamento, acciones_timbres: acciones_timbres, sucursal: id_sucursal,
                                    empresa: id_empresa, cargo: id_cargo, estado: false, ip_adress: ip_cliente, modulos: modulos,
                                    id_contrato: id_contrato
                                });
                            }
                        }
                        catch (error) {
                            return res.status(404).jsonp({ message: 'licencia_no_existe' });
                        }
                    }
                    else {
                        // VALIDAR SI EL USUARIO QUE ACCEDE ES ADMINISTRADOR
                        if (id_rol === 1) {
                            const token = jsonwebtoken_1.default.sign({
                                _licencia: public_key, codigo: codigo, _id: id, _id_empleado: id_empleado, rol: id_rol,
                                _web_access: web_access, _empresa: id_empresa, ip_adress: ip_cliente, modulos: modulos
                            }, process.env.TOKEN_SECRET || 'llaveSecreta', { expiresIn: 60 * 60 * 23, algorithm: 'HS512' });
                            return res.status(200).jsonp({
                                caducidad_licencia, token, usuario: user, rol: id_rol, empleado: id_empleado,
                                empresa: id_empresa, ip_adress: ip_cliente, modulos: modulos
                            });
                        }
                        else {
                            return res.jsonp({ message: 'error_' });
                        }
                    }
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            catch (error) {
                return res.jsonp({ message: 'error', text: ip_cliente });
            }
        });
    }
    // METODO PARA CAMBIAR CONTRASEÑA - ENVIO DE CORREO
    EnviarCorreoContrasena(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const correo = req.body.correo;
            const url_page = req.body.url_page;
            var tiempo = (0, settingsMail_1.fechaHora)();
            var fecha = yield (0, settingsMail_1.FormatearFecha)(tiempo.fecha_formato, settingsMail_1.dia_completo);
            var hora = yield (0, settingsMail_1.FormatearHora)(tiempo.hora);
            const path_folder = path_1.default.resolve('logos');
            const correoValido = yield database_1.default.query(`
      SELECT e.id, e.nombre, e.apellido, e.correo, u.usuario, u.contrasena 
      FROM empleados AS e, usuarios AS u 
      WHERE E.correo = $1 AND u.id_empleado = e.id
      `, [correo]);
            if (correoValido.rows[0] == undefined)
                return res.status(401).send('Correo de usuario no válido.');
            var datos = yield (0, settingsMail_1.Credenciales)(1);
            if (datos === 'ok') {
                const token = jsonwebtoken_1.default.sign({ _id: correoValido.rows[0].id }, process.env.TOKEN_SECRET_MAIL || 'llaveEmail', { expiresIn: 60 * 5, algorithm: 'HS512' });
                var url = url_page + '/confirmar-contrasenia';
                let data = {
                    to: correoValido.rows[0].correo,
                    from: settingsMail_1.email,
                    subject: 'FULLTIME CAMBIO DE CONTRASEÑA',
                    html: `
                <body>
                    <div style="text-align: center;">
                        <img width="25%" height="25%" src="cid:cabeceraf"/>
                    </div>
                    <br>
                    <p style="color:rgb(11, 22, 121); font-family: Arial; font-size:12px; line-height: 1em;">
                        El presente correo es para informar que se ha enviado un link para cambiar su contraseña. <br>  
                    </p>
                    <h3 style="font-family: Arial; text-align: center;">DATOS DEL SOLICITANTE</h3>
                    <p style="color:rgb(11, 22, 121); font-family: Arial; font-size:12px; line-height: 1em;">
                        <b>Empresa:</b> ${settingsMail_1.nombre} <br>   
                        <b>Asunto:</b> CAMBIAR CONTRASEÑA DE ACCESO <br> 
                        <b>Colaborador que envía:</b> ${correoValido.rows[0].nombre} ${correoValido.rows[0].apellido} <br>
                        <b>Generado mediante:</b> Aplicación Web <br>
                        <b>Fecha de envío:</b> ${fecha} <br> 
                        <b>Hora de envío:</b> ${hora} <br><br> 
                    </p>
                    <h3 style="font-family: Arial; text-align: center;">CAMBIAR CONTRASEÑA DE USUARIO</h3>
                        <p style="color:rgb(11, 22, 121); font-family: Arial; font-size:12px; line-height: 1em;">
                            <b>Ingrese al siguiente link y registre una nueva contraseña.</b> <br>   
                            <a href="${url}/${token}">${url}/${token}</a>  
                        </p>
                        <p style="font-family: Arial; font-size:12px; line-height: 1em;">
                            <b>Gracias por la atención</b><br>
                            <b>Saludos cordiales,</b> <br><br>
                        </p>
                        <img src="cid:pief" width="50%" height="50%"/>
                </body>
            `,
                    attachments: [
                        {
                            filename: 'cabecera_firma.jpg',
                            path: `${path_folder}/${settingsMail_1.cabecera_firma}`,
                            cid: 'cabeceraf' // COLOCAR EL MISMO cid EN LA ETIQUETA html img src QUE CORRESPONDA
                        },
                        {
                            filename: 'pie_firma.jpg',
                            path: `${path_folder}/${settingsMail_1.pie_firma}`,
                            cid: 'pief' //COLOCAR EL MISMO cid EN LA ETIQUETA html img src QUE CORRESPONDA
                        }
                    ]
                };
                var corr = (0, settingsMail_1.enviarMail)(settingsMail_1.servidor, parseInt(settingsMail_1.puerto));
                corr.sendMail(data, function (error, info) {
                    if (error) {
                        console.log('Email error: ' + error);
                        corr.close();
                        return res.jsonp({ message: 'error' });
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        corr.close();
                        return res.jsonp({ message: 'ok' });
                    }
                });
            }
            else {
                res.jsonp({ message: 'Ups!!! algo salio mal. No fue posible enviar correo electrónico.' });
            }
        });
    }
    // METODO PARA CAMBIAR CONTRASEÑA
    CambiarContrasenia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = req.body.token;
            var contrasena = req.body.contrasena;
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET_MAIL || 'llaveEmail');
                const id_empleado = payload._id;
                yield database_1.default.query(`
        UPDATE usuarios SET contrasena = $2 WHERE id_empleado = $1
        `, [id_empleado, contrasena]);
                return res.jsonp({
                    expiro: 'no',
                    message: "Contraseña actualizada. Intente ingresar con la nueva contraseña."
                });
            }
            catch (error) {
                return res.jsonp({
                    expiro: 'si',
                    message: "Tiempo para cambiar contraseña ha expirado. Vuelva a solicitar cambio de contraseña."
                });
            }
        });
    }
    // PRUEBA AUDITAR
    Auditar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { esquema, tabla, user, ip, old_data, new_data, accion } = req.body;
            yield database_1.default.query(' INSERT INTO audit.auditoria (schema_name, table_name, user_name, action, ' +
                'original_data, new_data, ip) ' +
                'VALUES ($1, $2, $3, substring($7,1,1), $4, $5, $6)', [esquema, tabla, user, old_data, new_data, ip, accion]);
            console.log('req auditar', req.body);
            res.jsonp({ message: 'Auditar' });
        });
    }
}
const LOGIN_CONTROLADOR = new LoginControlador();
exports.default = LOGIN_CONTROLADOR;
