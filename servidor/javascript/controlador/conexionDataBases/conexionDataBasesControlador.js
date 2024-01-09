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
exports.CONEXION_DATABASES_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../database"));
const database_adminFull_1 = __importDefault(require("../../database_adminFull"));
class ConexionDataBasesControlador {
    // METODO PARA OPTENER EL NOMBRE DE LA BASE DE DATOS
    setDatabaseName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            console.log('nombre base - : ', nombre);
            const dataBase = new database_adminFull_1.default('admin_fulltime');
            dataBase.conectar();
            try {
                const resultado = yield dataBase.realizarConsulta(`
      SELECT * FROM empresa as emp
      WHERE emp.nombre_database = $1
      `, [nombre]);
                console.log('resultado.rowCount: ', resultado.rowCount);
                if (resultado.rowCount > 0) {
                    return res.status(200).jsonp(resultado.rows);
                }
                else {
                    yield database_1.default.end();
                    return res.status(404).jsonp({ text: 'Registros no encontrados.' });
                }
            }
            catch (error) {
                yield database_1.default.end();
                return res.status(500).jsonp({ 'problemas de conexion al servidor': 'error' });
            }
            /*
            try {
              const { nombre } = req.params;
              const conexionData = await pool.query(
                `
                SELECT * FROM empresa as emp
                WHERE emp.nombre_database = $1
                `
                , [nombre]);
        
                if (conexionData.rowCount > 0) {
                  return res.jsonp(conexionData.rows)
              }
              else {
                return res.status(404).jsonp({ text: 'Registros no encontrados.' });
              }
            }catch (error) {
              return res.status(500).jsonp({ 'problemas de conexion al servidor': 'error' })
            }
            */
        });
    }
}
exports.CONEXION_DATABASES_CONTROLADOR = new ConexionDataBasesControlador();
exports.default = exports.CONEXION_DATABASES_CONTROLADOR;
