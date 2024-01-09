import { Request, Response } from 'express';
import pool from '../../database';
import { Credenciales, fechaHora, FormatearFecha, FormatearHora, dia_completo } from '../../libs/settingsMail';
import path from 'path';
const nodemailer = require("nodemailer");

class AutorizacionesControlador {

    // METODO PARA BUSCAR AUTORIZACIONES DE PERMISOS
    public async ObtenerAutorizacionPermiso(req: Request, res: Response) {
        const id = req.params.id_permiso
        const AUTORIZACIONES = await pool.query(
            `
            SELECT * FROM autorizaciones WHERE id_permiso = $1
            `
            , [id]);
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros.' });
        }
    }


    public async ListarAutorizaciones(req: Request, res: Response) {
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones ORDER BY id');
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }


    public async ObtenerAutorizacionByVacacion(req: Request, res: Response) {
        const id = req.params.id_vacacion
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones WHERE id_vacacion = $1', [id]);
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerAutorizacionByHoraExtra(req: Request, res: Response) {
        const id = req.params.id_hora_extra
        const AUTORIZACIONES = await pool.query('SELECT * FROM autorizaciones WHERE id_hora_extra = $1', [id]);
        if (AUTORIZACIONES.rowCount > 0) {
            return res.jsonp(AUTORIZACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearAutorizacion(req: Request, res: Response): Promise<any> {
        const { orden, estado, id_departamento, id_permiso, id_vacacion, id_hora_extra,
            id_plan_hora_extra, id_documento } = req.body;
        await pool.query('INSERT INTO autorizaciones ( orden, estado, id_departamento, ' +
            'id_permiso, id_vacacion, id_hora_extra, id_plan_hora_extra, id_documento) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [orden, estado, id_departamento, id_permiso, id_vacacion, id_hora_extra,
                id_plan_hora_extra, id_documento]);
        res.jsonp({ message: 'Autorizacion guardado' });
    }






    public async ActualizarEstadoAutorizacionPermiso(req: Request, res: Response): Promise<void> {
        const { id_documento, estado, id_permiso } = req.body;

        await pool.query('UPDATE autorizaciones SET estado = $1, id_documento = $2 WHERE id_permiso = $3',
            [estado, id_documento, id_permiso]);
        res.jsonp({ message: 'Autorizacion guardado' });
    }



    public async ActualizarEstadoPlanificacion(req: Request, res: Response): Promise<void> {

        var tiempo = fechaHora();
        var fecha = await FormatearFecha(tiempo.fecha_formato, dia_completo);
        var hora = await FormatearHora(tiempo.hora);

        const path_folder = path.resolve('logos');

        var datos = await Credenciales(parseInt(req.params.id_empresa));

        if (datos === 'ok') {


            const id = req.params.id_plan_hora_extra;
            //const { id_documento, estado, id_hora_extra, id_departamento } = req.body;
            const { id_documento, estado } = req.body;
            await pool.query('UPDATE autorizaciones SET estado = $1, id_documento = $2 WHERE id_plan_hora_extra = $3', [estado, id_documento, id]);
            res.jsonp({ message: 'Autorizacion guardado' });

            /*const JefeDepartamento = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [id_departamento]);
            const InfoHoraExtraReenviarEstadoEmpleado = await pool.query('SELECT h.descripcion, h.fec_inicio, h.fec_final, h.fec_solicita, h.estado, h.num_hora, h.id, e.id AS empleado, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo, c.hora_extra_mail, c.hora_extra_noti FROM empleados AS e, empl_cargos AS ecr, hora_extr_pedidos AS h, config_noti AS c WHERE h.id = $1 AND h.id_empl_cargo = ecr.id AND e.id = h.id_usua_solicita AND e.id = c.id_empleado ORDER BY cargo DESC LIMIT 1', [id_hora_extra]);
    
            const estadoAutorizacion = [
                { id: 1, nombre: 'Pendiente' },
                { id: 2, nombre: 'Pre-autorizado' },
                { id: 3, nombre: 'Autorizado' },
                { id: 4, nombre: 'Negado' },
            ];
    
            let nombreEstado = '';
            estadoAutorizacion.forEach(obj => {
                if (obj.id === estado) {
                    nombreEstado = obj.nombre
                }
            })
    
            JefeDepartamento.rows.forEach(obj => {
                var url = `${process.env.URL_DOMAIN}/horaExtraEmpleado`;
                InfoHoraExtraReenviarEstadoEmpleado.rows.forEach(ele => {
                    let notifi_realtime = {
                        id_send_empl: obj.empleado,
                        id_receives_depa: obj.id_dep,
                        estado: nombreEstado,
                        id_permiso: null,
                        id_vacaciones: null,
                        id_hora_extra: id_hora_extra
                    }
    
                    let data = {
                        from: obj.correo,
                        to: ele.correo,
                        subject: 'Estado de la Autorización de Hora Extra',
                        html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                        cédula ${obj.cedula} a cambiado el estado de la Autorización de su solicitud de hora extra a: <b>${nombreEstado}</b></p>
                        <h4><b>Informacion de las vacaciones</b></h4>
                        <ul>
                            <li><b>Empleado</b>: ${ele.nombre} ${ele.apellido} </li>
                            <li><b>Cédula</b>: ${ele.cedula} </li>
                            <li><b>Sucursal</b>: ${obj.sucursal} </li>
                            <li><b>Departamento</b>: ${obj.departamento} </li>
                            </ul>
                        <a href="${url}">Ir a verificar estado hora extra</a>`
                    };
    
                    if (ele.hora_extra_mail === true && ele.hora_extra_noti === true) {
                         var corr = enviarMail(servidor, parseInt(puerto));
                    corr.sendMail(data, function (error: any, info: any) {
                        if (error) {
                            console.log('Email error: ' + error);
                            return res.jsonp({ message: 'error' });
                        } else {
                            console.log('Email sent: ' + info.response);
                            return res.jsonp({ message: 'ok' });
                        }
                    });
    
                        res.json({ message: 'Estado de las hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                    } else if (ele.hora_extra_mail === true && ele.hora_extra_noti === false) {
                         var corr = enviarMail(servidor, parseInt(puerto));
                    corr.sendMail(data, function (error: any, info: any) {
                        if (error) {
                            console.log('Email error: ' + error);
                            return res.jsonp({ message: 'error' });
                        } else {
                            console.log('Email sent: ' + info.response);
                            return res.jsonp({ message: 'ok' });
                        }
                    });
    
                        res.json({ message: 'Estado de las hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                    } else if (ele.hora_extra_mail === false && ele.hora_extra_noti === true) {
                        res.json({ message: 'Estado de las hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
                    } else if (ele.hora_extra_mail === false && ele.hora_extra_noti === false) {
                        res.json({ message: 'Estado de las hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
                    }
    
                });
            });*/
        }
        else {
            res.jsonp({ message: 'Ups! algo salio mal!!! No fue posible enviar correo electrónico.' });
        }
    }


    /** ***************************************************************************************************** ** 
     ** **                METODO DE CAMBIO DE ESTADO DE APROBACIONES DE SOLICITUDES                        ** ** 
     ** ***************************************************************************************************** **/

    // METODO DE APROBACION DE SOLICITUD DE PERMISO
    public async ActualizarEstadoSolicitudes(req: Request, res: Response): Promise<void> {

        const id = req.params.id;
        const { id_documento, estado } = req.body;

        await pool.query(
            `
                UPDATE autorizaciones SET estado = $1, id_documento = $2 WHERE id = $3
                `
            , [estado, id_documento, id]);

        res.jsonp({ message: 'Registro exitoso.' });
    }
}

export const AUTORIZACION_CONTROLADOR = new AutorizacionesControlador();

export default AUTORIZACION_CONTROLADOR;