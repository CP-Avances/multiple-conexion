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
exports.EMPLEADO_HORARIOS_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../../database"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
class EmpleadoHorariosControlador {
    // BUSCAR HORARIOS DEL USUARIO
    ListarHorarioUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            const HORARIOS = yield database_1.default.query(`
            SELECT eh.id, eh.id_empl_cargo, eh.fec_inicio, eh.fec_final,
                eh.lunes, eh.martes, eh.miercoles, eh.jueves, eh.viernes, eh.sabado, eh.domingo, 
                eh.id_horarios, eh.estado, eh.codigo, ch.nombre AS nom_horario
            FROM empl_horarios AS eh, cg_horarios AS ch
            WHERE eh.id_horarios = ch.id AND eh.codigo = $1 ORDER BY eh.id DESC
            `, [codigo]);
            if (HORARIOS.rowCount > 0) {
                return res.jsonp(HORARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    // CREACION DE HORARIO
    CrearEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, codigo } = req.body;
            yield database_1.default.query(`
            INSERT INTO empl_horarios (id_empl_cargo, fec_inicio, fec_final, 
            lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, codigo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `, [id_empl_cargo, fec_inicio, fec_final, lunes, martes, miercoles, jueves,
                viernes, sabado, domingo, id_horarios, estado, codigo]);
            res.jsonp({ message: 'Registro guardado.' });
        });
    }
    // ACTUALIZAR HORARIO ASIGNADO AL USUARIO
    ActualizarEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empl_cargo, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, id } = req.body;
            try {
                const [result] = yield database_1.default.query(`
                UPDATE empl_horarios SET id_empl_cargo = $1, fec_inicio = $2, fec_final = $3, lunes = $4, 
                martes = $5, miercoles = $6, jueves = $7, viernes = $8, sabado = $9, domingo = $10, id_horarios = $11, 
                estado = $12 WHERE id = $13 RETURNING *
                `, [id_empl_cargo, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado,
                    domingo, id_horarios, estado, id])
                    .then((result) => { return result.rows; });
                if (result === undefined)
                    return res.status(404).jsonp({ message: 'Horario no actualizado.' });
                return res.status(200).jsonp({ message: 'El horario del empleado se registró con éxito.' });
            }
            catch (error) {
                return res.status(500).jsonp({ message: 'Registros no encontrados.' });
            }
        });
    }
    // METODO PARA BUSCAR HORARIOS DEL EMPLEADO EN DETERMINADA FECHA  --**VERIFICADO
    VerificarHorariosExistentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio, fechaFinal } = req.body;
            const { codigo } = req.params;
            const HORARIO = yield database_1.default.query(`
            SELECT DISTINCT pg.id_horario, ch.hora_trabajo, ch.codigo, ch.default  
            FROM plan_general AS pg, cg_horarios AS ch
            WHERE pg.codigo = $3 AND pg.id_horario = ch.id AND
                (fec_horario BETWEEN $1 AND $2)
            `, [fechaInicio, fechaFinal, codigo]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados.' });
            }
        });
    }
    //TODO Revisar tabla empl_horarios
    // METODO PARA BUSCAR HORARIOS DEL EMPLEADO EN DETERMINADA FECHA PROCESO EDICION
    VerificarHorariosExistentesEdicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio, fechaFinal, id } = req.body;
            const { empl_id } = req.params;
            const HORARIO = yield database_1.default.query(`
            SELECT ch.hora_trabajo, eh.fec_inicio, eh.fec_final
            FROM empl_horarios AS eh, empleados AS e, cg_horarios AS ch
            WHERE NOT eh.id = $4 AND ($1 BETWEEN fec_inicio AND fec_final
                OR $2 BETWEEN fec_inicio AND fec_final OR fec_inicio BETWEEN $1 AND $2
                OR fec_final BETWEEN $1 AND $2) AND eh.codigo::varchar = e.codigo AND e.estado = 1
                AND eh.id_horarios = ch.id AND e.id = $3
            `, [fechaInicio, fechaFinal, empl_id, id]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    //TODO Revisar empl_horarios
    // METODO PARA CONSULTAR HORARIO DEL USUARIO POR DIAS Y NUMERO DE HORAS DE TRABAJO
    ObtenerHorarioDias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { codigo, fecha_inicio, fecha_final } = req.body;
            // CONSULTA DE HORARIOS FIJOS DEL EMPLEADO
            let fijo = yield database_1.default.query(`
            SELECT eh.fec_inicio, eh.fec_final, ec.hora_trabaja
            FROM empl_horarios AS eh, empl_cargos AS ec
            WHERE eh.id_empl_cargo = ec.id AND eh.codigo::varchar = $1
			    AND (($2 BETWEEN eh.fec_inicio AND eh.fec_final)
			    OR ($3 BETWEEN eh.fec_inicio AND eh.fec_final))
            `, [codigo, fecha_inicio, fecha_final])
                .then((result) => { return result.rows; });
            if (fijo.length === 0) {
                // METODO PARA BUSCAR HORARIOS ROTATIVOS
                let rotativo = yield database_1.default.query(`
                SELECT ph.fec_inicio, ph.fec_final, ec.hora_trabaja
                FROM plan_horarios AS ph, empl_cargos AS ec
                WHERE ph.id_cargo = ec.id AND ph.estado = true 
                    AND ph.codigo = $1
                    AND (($2 BETWEEN ph.fec_inicio AND ph.fec_final)
                    OR ($3 BETWEEN ph.fec_inicio AND ph.fec_final))
                `, [codigo, fecha_inicio, fecha_final])
                    .then((result) => { return result.rows; });
                if (rotativo.length === 0) {
                    return res.status(404).jsonp({ message: 'No se han encontrado registros.' });
                }
                else {
                    return res.status(200).jsonp(rotativo);
                }
            }
            else {
                return res.status(200).jsonp(fijo);
            }
        });
    }
    // METODO PARA CONSULTAR HORARIO DEL USUARIO POR DIAS-HORAS Y NUMERO DE HORAS DE TRABAJO EN EL MISMO DIA (MD)
    ObtenerHorarioHorasMD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { codigo, fecha_inicio, hora_inicio, hora_final } = req.body;
            // CONSULTA DE HORARIO DEL USUARIO INGRESO = SALIDA
            let CASO_1 = yield database_1.default.query(`
            SELECT * FROM vista_horario_entrada AS he
            JOIN vista_horario_salida AS hs ON he.codigo = hs.codigo AND he.fecha_entrada = hs.fecha_salida 
                AND he.id_horario = hs.id_horario AND salida_otro_dia = 0 AND he.codigo = $1
				AND he.fecha_entrada = $2
                AND (($3 BETWEEN hora_inicio AND hora_final) AND ($4 BETWEEN hora_inicio AND hora_final))
            `, [codigo, fecha_inicio, hora_inicio, hora_final])
                .then((result) => { return result.rows; });
            if (CASO_1.length === 0) {
                // CONSULTA DE HORARIO DEL USUARIO INGRESO != SALIDA (SEGUNDO DIA)
                let CASO_2 = yield database_1.default.query(`
                SELECT * FROM vista_horario_entrada AS he
                JOIN vista_horario_salida AS hs ON he.codigo = hs.codigo 
                    AND hs.fecha_salida = (he.fecha_entrada + interval '1 day')
                    AND he.id_horario = hs.id_horario AND salida_otro_dia = 1 AND he.codigo = $1
                    AND ($2 = he.fecha_entrada OR $2 = hs.fecha_salida)
                `, [codigo, fecha_inicio])
                    .then((result) => { return result.rows; });
                if (CASO_2.length === 0) {
                    // CONSULTA DE HORARIO DEL USUARIO INGRESO != SALIDA (TERCER DIA)
                    let CASO_3 = yield database_1.default.query(`
                    SELECT * FROM vista_horario_entrada AS he
                    JOIN vista_horario_salida AS hs ON he.codigo = hs.codigo 
			            AND hs.fecha_salida = (he.fecha_entrada + interval '2 day')
                        AND he.id_horario = hs.id_horario AND salida_otro_dia = 2 AND he.codigo = $1
                        AND ($2 = he.fecha_entrada OR $2 = hs.fecha_salida OR $2= (he.fecha_entrada + interval '1 day'))
                `, [codigo, fecha_inicio])
                        .then((result) => { return result.rows; });
                    if (CASO_3.length === 0) {
                        return res.status(404).jsonp({ message: 'No se han encontrado registros.' });
                    }
                    else {
                        return res.status(200).jsonp({ message: 'CASO_3', respuesta: CASO_3 });
                    }
                }
                else {
                    return res.status(200).jsonp({ message: 'CASO_2', respuesta: CASO_2 });
                }
            }
            else {
                return res.status(200).jsonp({ message: 'CASO_1', respuesta: CASO_1 });
            }
        });
    }
    // METODO PARA CONSULTAR HORARIO DEL USUARIO POR DIAS-HORAS Y NUMERO DE HORAS DE TRABAJO EN DIAS DIFERENTES (DD)
    ObtenerHorarioHorasDD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { codigo, fecha_inicio, fecha_final } = req.body;
            // CONSULTA DE HORARIO DEL USUARIO INGRESO = SALIDA
            let CASO_4 = yield database_1.default.query(`
            SELECT * FROM vista_horario_entrada AS he
            JOIN vista_horario_salida AS hs ON he.codigo = hs.codigo 
			    AND hs.fecha_salida = (he.fecha_entrada + interval '1 day')
                AND he.id_horario = hs.id_horario AND salida_otro_dia = 1 AND he.codigo = $1
				AND $2 = he.fecha_entrada AND $3 = hs.fecha_salida
            `, [codigo, fecha_inicio, fecha_final])
                .then((result) => { return result.rows; });
            if (CASO_4.length === 0) {
                // CONSULTA DE HORARIOS MAYORES O IGUALES A 48 HORAS
                let CASO_5 = yield database_1.default.query(`
                SELECT * FROM vista_horario_entrada AS he
                JOIN vista_horario_salida AS hs ON he.codigo = hs.codigo 
			        AND hs.fecha_salida = (he.fecha_entrada + interval '2 day')
                    AND he.id_horario = hs.id_horario AND salida_otro_dia = 2 AND he.codigo = $1
                    AND ($2 = he.fecha_entrada OR $2 = (he.fecha_entrada + interval '1 day')) 
                    AND ($3 = hs.fecha_salida OR $3 = (he.fecha_entrada + interval '1 day'))
                `, [codigo, fecha_inicio, fecha_final])
                    .then((result) => { return result.rows; });
                if (CASO_5.length === 0) {
                    return res.status(404).jsonp({ message: 'No se han encontrado registros.' });
                }
                else {
                    return res.status(200).jsonp({ message: 'CASO_5', respuesta: CASO_5 });
                }
            }
            else {
                return res.status(200).jsonp({ message: 'CASO_4', respuesta: CASO_4 });
            }
        });
    }
    // METODO PARA BUSCAR HORAS DE ALIMENTACION EN EL MISMO DIA (MD)
    ObtenerComidaHorarioHorasMD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { codigo, fecha_inicio, hora_inicio, hora_final } = req.body;
            // CONSULTA DE HORARIO DEL USUARIO INGRESO = SALIDA
            let CASO_1 = yield database_1.default.query(`
            SELECT * FROM vista_comida_inicio AS ci
            JOIN vista_comida_fin AS cf ON ci.codigo = cf.codigo AND ci.fecha_entrada = cf.fecha_salida 
                AND ci.id_horario = cf.id_horario AND salida_otro_dia = 0 AND ci.codigo = $1
                AND ci.fecha_entrada = $2
                AND (($3 BETWEEN hora_inicio AND hora_final) OR ($4 BETWEEN hora_inicio AND hora_final))
            `, [codigo, fecha_inicio, hora_inicio, hora_final])
                .then((result) => { return result.rows; });
            if (CASO_1.length === 0) {
                // CONSULTA DE HORARIO DEL USUARIO INGRESO != SALIDA (SEGUNDO DIA)
                let CASO_2 = yield database_1.default.query(`
                SELECT * FROM vista_comida_inicio AS ci
                JOIN vista_comida_fin AS cf ON ci.codigo = cf.codigo 
                    AND cf.fecha_salida = (ci.fecha_entrada + interval '1 day')
                    AND ci.id_horario = cf.id_horario AND salida_otro_dia = 1 AND ci.codigo = $1
                    AND ($2 = ci.fecha_entrada OR $2 = cf.fecha_salida)
                `, [codigo, fecha_inicio])
                    .then((result) => { return result.rows; });
                if (CASO_2.length === 0) {
                    return res.status(404).jsonp({ message: 'No se han encontrado registros.' });
                }
                else {
                    return res.status(200).jsonp({ message: 'CASO_2', respuesta: CASO_2 });
                }
            }
            else {
                return res.status(200).jsonp({ message: 'CASO_1', respuesta: CASO_1 });
            }
        });
    }
    // METODO PARA CONSULTAR MINUTOS DE ALIMENTACION EN DIAS DIFERENTES (DD)
    ObtenerComidaHorarioHorasDD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { codigo, fecha_inicio, fecha_final } = req.body;
            // CONSULTA DE HORARIO DEL USUARIO INGRESO != SALIDA
            let CASO_4 = yield database_1.default.query(`
            SELECT * FROM vista_comida_inicio AS ci
            JOIN vista_comida_fin AS cf ON ci.codigo = cf.codigo 
                AND cf.fecha_salida = (ci.fecha_entrada + interval '1 day')
                AND ci.id_horario = cf.id_horario AND salida_otro_dia = 1 AND ci.codigo = $1
                AND $2 = ci.fecha_entrada AND $3 = cf.fecha_salida
            `, [codigo, fecha_inicio, fecha_final])
                .then((result) => { return result.rows; });
            if (CASO_4.length === 0) {
                return res.status(404).jsonp({ message: 'No se han encontrado registros.' });
            }
            else {
                return res.status(200).jsonp({ message: 'CASO_4', respuesta: CASO_4 });
            }
        });
    }
    // VERIFICAR EXISTENCIA DE PLANIFICACION   --**VERIFICADO
    VerificarFechasHorario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaInicio, fechaFinal, id_horario } = req.body;
            const { codigo } = req.params;
            const HORARIO = yield database_1.default.query(`
            SELECT id FROM plan_general 
            WHERE codigo = $3 AND id_horario = $4 AND
                (fec_horario BETWEEN $1 AND $2) LIMIT 4
            `, [fechaInicio, fechaFinal, codigo, id_horario]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    ListarEmpleadoHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const HORARIOS = yield database_1.default.query('SELECT * FROM empl_horarios WHERE estado = 1');
            if (HORARIOS.rowCount > 0) {
                return res.jsonp(HORARIOS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    /** Verificar datos de plantilla de multiples horarios para un solo empleado */
    VerificarDatos_PlantillaEmpleado_Horario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarDatos = 0;
            var contarHorario = 0;
            var contarDetalles = 0;
            var contarCargo = 0;
            var contarFechas = 0;
            var contarFechasValidas = 0;
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                // Verificar que existan los datos
                if (fecha_inicio != undefined && fecha_final != undefined && lunes != undefined && martes != undefined && miercoles != undefined &&
                    jueves != undefined && viernes != undefined && sabado != undefined && domingo != undefined && nombre_horario != undefined &&
                    estado != undefined) {
                    contarDatos = contarDatos + 1;
                }
                // Verificar que exista horario
                if (nombre_horario != undefined && fecha_inicio != undefined && fecha_final != undefined) {
                    const HORARIO = yield database_1.default.query('SELECT id FROM cg_horarios WHERE UPPER(nombre) = $1', [nombre_horario.toUpperCase()]);
                    if (HORARIO.rowCount != 0) {
                        contarHorario = contarHorario + 1;
                        // Verificar que exista detalles de horario
                        const DETALLES = yield database_1.default.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [HORARIO.rows[0]['id']]);
                        if (DETALLES.rowCount != 0) {
                            contarDetalles = contarDetalles + 1;
                            // Verificar que no exista registrado Horario en el empleado
                            const FECHAS = yield database_1.default.query('SELECT * FROM datos_empleado_cargo AS dc INNER JOIN ' +
                                '(SELECT * FROM empl_horarios WHERE ($1 BETWEEN fec_inicio AND fec_final ' +
                                'OR $2 BETWEEN fec_inicio AND fec_final OR fec_inicio BETWEEN $1 AND $2 ' +
                                'OR fec_final BETWEEN $1 AND $2) AND id_horarios = $4) AS h ' +
                                'ON h.id_empl_cargo = dc.cargo_id  AND dc.empl_id = $3 AND dc.estado_empl = 1', [fecha_inicio, fecha_final, id, HORARIO.rows[0]['id']]);
                            if (FECHAS.rowCount === 0) {
                                contarFechas = contarFechas + 1;
                            }
                        }
                    }
                }
                // Verificar que las fechas sean validas
                if (fecha_inicio != undefined && fecha_final != undefined) {
                    var inicio = new Date(fecha_inicio.split('/')[2] + '-' + fecha_inicio.split('/')[1] + '-' + fecha_inicio.split('/')[0] + 'T00:00:00');
                    var final = new Date(fecha_final.split('/')[2] + '-' + fecha_final.split('/')[1] + '-' + fecha_final.split('/')[0] + 'T00:00:00');
                    console.log('fecha_inicio', Date.parse((0, moment_1.default)(inicio).format('YYYY-MM-DD')), 'fecha_fin', Date.parse((0, moment_1.default)(final).format('YYYY-MM-DD')));
                    if (Date.parse((0, moment_1.default)(inicio).format('YYYY-MM-DD')) <= Date.parse((0, moment_1.default)(final).format('YYYY-MM-DD'))) {
                        contarFechasValidas = contarFechasValidas + 1;
                    }
                }
                // Verificar que exista cargo del empleado
                const CARGO = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e ' +
                    'WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
                if (CARGO.rowCount != 0) {
                    contarCargo = contarCargo + 1;
                }
                console.log('datos', contarFechas, contarFechasValidas, contarHorario, contarDatos, contarDetalles, contarCargo, contador);
                if (contador === plantilla.length) {
                    if (contarDatos === plantilla.length && contarHorario === plantilla.length &&
                        contarDetalles === plantilla.length && contarFechas === plantilla.length &&
                        contarCargo === plantilla.length && contarFechasValidas === plantilla.length) {
                        return res.jsonp({ message: 'correcto' });
                    }
                    else {
                        return res.jsonp({ message: 'error' });
                    }
                }
                contador = contador + 1;
            }));
            // VERIFICAR EXISTENCIA DE CARPETA O ARCHIVO
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                if (err) {
                }
                else {
                    // ELIMINAR DEL SERVIDOR
                    fs_1.default.unlinkSync(filePath);
                }
            });
        });
    }
    /** Verificar que los datos de la plantilla no se encuentren duplicados */
    VerificarPlantilla_HorarioEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarDatosData = 0;
            var contarFechas = 0;
            var contador_arreglo = 1;
            var arreglos_datos = [];
            //Leer la plantilla para llenar un array con los datos cedula y usuario para verificar que no sean duplicados
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Datos que se leen de la plantilla ingresada
                const { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                let datos_array = {
                    fec_inicio: fecha_inicio,
                    fec_final: fecha_final,
                    horario: nombre_horario
                };
                arreglos_datos.push(datos_array);
            }));
            function compare(a, b) {
                var inicio_1 = new Date(a.fec_inicio.split('/')[2] + '-' + a.fec_inicio.split('/')[1] + '-' + a.fec_inicio.split('/')[0] + 'T00:00:00');
                var inicio_2 = new Date(b.fec_inicio.split('/')[2] + '-' + b.fec_inicio.split('/')[1] + '-' + b.fec_inicio.split('/')[0] + 'T00:00:00');
                if (Date.parse((0, moment_1.default)(inicio_1).format('YYYY-MM-DD')) < Date.parse((0, moment_1.default)(inicio_2).format('YYYY-MM-DD'))) {
                    return -1;
                }
                if (Date.parse((0, moment_1.default)(inicio_1).format('YYYY-MM-DD')) > Date.parse((0, moment_1.default)(inicio_2).format('YYYY-MM-DD'))) {
                    return 1;
                }
                return 0;
            }
            arreglos_datos.sort(compare);
            // Vamos a verificar dentro de arreglo_datos que no se encuentren datos duplicados
            for (var i = 0; i <= arreglos_datos.length - 1; i++) {
                for (var j = 0; j <= arreglos_datos.length - 1; j++) {
                    if (arreglos_datos[i].horario.toUpperCase() === arreglos_datos[j].horario.toUpperCase() &&
                        arreglos_datos[i].fec_inicio === arreglos_datos[j].fec_inicio &&
                        arreglos_datos[i].fec_final === arreglos_datos[j].fec_final) {
                        contarDatosData = contarDatosData + 1;
                    }
                    if (j > i) {
                        var inicio_1 = new Date(arreglos_datos[i].fec_inicio.split('/')[2] + '-' + arreglos_datos[i].fec_inicio.split('/')[1] + '-' + arreglos_datos[i].fec_inicio.split('/')[0] + 'T00:00:00');
                        var inicio_2 = new Date(arreglos_datos[j].fec_inicio.split('/')[2] + '-' + arreglos_datos[j].fec_inicio.split('/')[1] + '-' + arreglos_datos[j].fec_inicio.split('/')[0] + 'T00:00:00');
                        var final_1 = new Date(arreglos_datos[i].fec_final.split('/')[2] + '-' + arreglos_datos[i].fec_final.split('/')[1] + '-' + arreglos_datos[i].fec_final.split('/')[0] + 'T00:00:00');
                        console.log('if', Date.parse((0, moment_1.default)(inicio_1).format('YYYY-MM-DD')), Date.parse((0, moment_1.default)(inicio_2).format('YYYY-MM-DD')), Date.parse((0, moment_1.default)(final_1).format('YYYY-MM-DD')));
                        if (Date.parse((0, moment_1.default)(inicio_1).format('YYYY-MM-DD')) <= Date.parse((0, moment_1.default)(inicio_2).format('YYYY-MM-DD')) &&
                            Date.parse((0, moment_1.default)(inicio_2).format('YYYY-MM-DD')) > Date.parse((0, moment_1.default)(final_1).format('YYYY-MM-DD'))) {
                        }
                        else {
                            if (arreglos_datos[i].horario.toUpperCase() === arreglos_datos[j].horario.toUpperCase()) {
                                contarFechas = contarFechas + 1;
                            }
                        }
                    }
                }
                if (contarFechas != 0) {
                    // break;
                    console.log('conto 1');
                }
                contador_arreglo = contador_arreglo + 1;
            }
            console.log('intermedios', contarFechas);
            if (contarFechas != 0) {
                return res.jsonp({ message: 'error' });
            }
            else {
                if (contarDatosData === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            fs_1.default.unlinkSync(filePath);
            /* if ((contador_arreglo - 1) === plantilla.length) {
                 if (contarDatosData === plantilla.length && contarFechas === 0) {
                     return res.jsonp({ message: 'correcto' });
                 } else {
                     return res.jsonp({ message: 'error' });
                 }
             }*/
        });
    }
    CrearHorarioEmpleadoPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { codigo } = req.params;
                var { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                const id_cargo = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
                var id_empl_cargo = id_cargo.rows[0]['max'];
                ;
                var nombre = nombre_horario;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE UPPER(nombre) = $1', [nombre.toUpperCase()]);
                var id_horarios = idHorario.rows[0]['id'];
                var id_hora = 1;
                yield database_1.default.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0], codigo]);
                res.jsonp({ message: 'correcto' });
            }));
            // VERIFICAR EXISTENCIA DE CARPETA O ARCHIVO
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                if (err) {
                }
                else {
                    // ELIMINAR DEL SERVIDOR
                    fs_1.default.unlinkSync(filePath);
                }
            });
        });
    }
    /** Crear Planificacion General con los datos de la plantilla ingresada */
    CrearPlanificacionGeneral(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var arrayDetalles = [];
            //Leer la plantilla para llenar un array con los datos cedula y usuario para verificar que no sean duplicados
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { codigo } = req.params;
                // Datos que se leen de la plantilla ingresada
                const { fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                const HORARIO = yield database_1.default.query('SELECT id FROM cg_horarios WHERE UPPER(nombre) = $1', [nombre_horario.toUpperCase()]);
                const CARGO = yield database_1.default.query('SELECT MAX(ec.id) FROM empl_cargos AS ec, empl_contratos AS ce, empleados AS e ' +
                    'WHERE ce.id_empleado = e.id AND ec.id_empl_contrato = ce.id AND e.id = $1', [id]);
                // Detalle de horario
                const DETALLES = yield database_1.default.query('SELECT * FROM deta_horarios WHERE id_horario = $1', [HORARIO.rows[0]['id']]);
                arrayDetalles = DETALLES.rows;
                var fechasHorario = []; // Array que contiene todas las fechas del mes indicado 
                // Inicializar datos de fecha
                var start = new Date(fecha_inicio.split('/')[2] + '-' + fecha_inicio.split('/')[1] + '-' + fecha_inicio.split('/')[0] + 'T00:00:00');
                var end = new Date(fecha_final.split('/')[2] + '-' + fecha_final.split('/')[1] + '-' + fecha_final.split('/')[0] + 'T00:00:00');
                // Lógica para obtener el nombre de cada uno de los día del periodo indicado
                while (start <= end) {
                    /* console.log(moment(start).format('dddd DD/MM/YYYY'), form.lunesForm)
                     if (moment(start).format('dddd') === 'lunes' && form.lunesForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'martes' && form.martesForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'miércoles' && form.miercolesForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'jueves' && form.juevesForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'viernes' && form.viernesForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'sábado' && form.sabadoForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }
                     if (moment(start).format('dddd') === 'domingo' && form.domingoForm === false) {
                       this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
                     }*/
                    fechasHorario.push((0, moment_1.default)(start).format('YYYY-MM-DD'));
                    var newDate = start.setDate(start.getDate() + 1);
                    start = new Date(newDate);
                }
                fechasHorario.map(obj => {
                    arrayDetalles.map((element) => __awaiter(this, void 0, void 0, function* () {
                        var accion = 0;
                        if (element.tipo_accion === 'E') {
                            accion = element.minu_espera;
                        }
                        var estado = null;
                        yield database_1.default.query('INSERT INTO plan_general (fec_hora_horario, tolerancia, estado, id_det_horario, ' +
                            'fec_horario, id_empl_cargo, tipo_entr_salida, codigo, id_horario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [obj + ' ' + element.hora, accion, estado, element.id,
                            obj, CARGO.rows[0]['max'], element.tipo_accion, codigo, HORARIO.rows[0]['id']]);
                    }));
                });
                return res.jsonp({ message: 'correcto' });
            }));
            // VERIFICAR EXISTENCIA DE CARPETA O ARCHIVO
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                if (err) {
                }
                else {
                    // ELIMINAR DEL SERVIDOR
                    fs_1.default.unlinkSync(filePath);
                }
            });
        });
    }
    CargarMultiplesHorariosEmpleadosPlantilla(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                var { cedula, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, nombre_horario, estado } = data;
                const id_cargo = yield database_1.default.query('SELECT MAX(ecargo.id) FROM empl_cargos AS ecargo, empl_contratos AS econtrato, empleados AS e WHERE econtrato.id_empleado = e.id AND ecargo.id_empl_contrato = econtrato.id AND e.cedula = $1', [cedula]);
                var id_empl_cargo = id_cargo.rows[0]['max'];
                ;
                var nombre = nombre_horario;
                const idHorario = yield database_1.default.query('SELECT id FROM cg_horarios WHERE nombre = $1', [nombre]);
                var id_horarios = idHorario.rows[0]['id'];
                var id_hora = 1;
                yield database_1.default.query('INSERT INTO empl_horarios (id_empl_cargo, id_hora, fec_inicio, fec_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [id_empl_cargo, id_hora, fecha_inicio, fecha_final, lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_horarios, estado.split("-")[0]]);
                console.log("carga exitosa");
            }));
            res.jsonp({ message: 'La plantilla a sido receptada' });
            // VERIFICAR EXISTENCIA DE CARPETA O ARCHIVO
            fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
                if (err) {
                }
                else {
                    // ELIMINAR DEL SERVIDOR
                    fs_1.default.unlinkSync(filePath);
                }
            });
        });
    }
    EliminarRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            yield database_1.default.query('DELETE FROM empl_horarios WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado.' });
        });
    }
    ObtenerHorariosEmpleadoFechas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            const { fechaInicio, fechaFinal } = req.body;
            const HORARIO = yield database_1.default.query('SELECT * FROM datos_empleado_cargo AS dec ' +
                'INNER JOIN (SELECT * FROM empl_horarios) AS eh ' +
                'ON dec.cargo_id = eh.id_empl_cargo AND dec.codigo = $1 AND dec.estado_empl = 1 ' +
                'AND (eh.fec_inicio BETWEEN $2 AND $3 OR ' +
                'eh.fec_final BETWEEN $2 AND $3)', [codigo, fechaInicio, fechaFinal]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    VerificarFechasHorarioEdicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { codigo } = req.params;
            const { fechaInicio, fechaFinal, id_horario } = req.body;
            const HORARIO = yield database_1.default.query('SELECT * FROM empl_horarios WHERE NOT id=$3 AND ' +
                '($1 BETWEEN fec_inicio AND fec_final OR $2 BETWEEN fec_inicio AND fec_final ' +
                'OR fec_inicio BETWEEN $1 AND $2 OR fec_final BETWEEN $1 AND $2) AND id_horarios = $5 ' +
                'AND codigo = $4', [fechaInicio, fechaFinal, id, codigo, id_horario]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    BuscarHorariosFechas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codigo = req.params.codigo;
            const { fechaInicio, fechaFinal } = req.body;
            const HORARIO = yield database_1.default.query('SELECT * FROM empl_horarios WHERE codigo = $1 AND $2 ' +
                'BETWEEN fec_inicio AND fec_final AND $3 BETWEEN fec_inicio AND fec_final', [codigo, fechaInicio, fechaFinal]);
            if (HORARIO.rowCount > 0) {
                return res.jsonp(HORARIO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
}
exports.EMPLEADO_HORARIOS_CONTROLADOR = new EmpleadoHorariosControlador();
exports.default = exports.EMPLEADO_HORARIOS_CONTROLADOR;
