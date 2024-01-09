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
Object.defineProperty(exports, "__esModule", { value: true });
// CONEXION CON LA BASE DE DATOS POSTGRESQL
const pg_1 = require("pg");
class DataAdmin {
    constructor(dbName) {
        this.dbName = dbName;
        this.dataAdmin = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            port: 5432,
            database: this.dbName,
            password: '12345'
        });
    }
    conectar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dataAdmin.connect();
                // Realiza operaciones con la base de datos
                console.log('Conexión exitosa - ' + this.dbName);
            }
            catch (error) {
                console.error('Error al conectar:', error);
            }
        });
    }
    cerrarConexion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dataAdmin.end();
                console.log('Conexión cerrada admin_fulltime');
            }
            catch (error) {
                console.error('Error al cerrar la conexión: ', error);
            }
        });
    }
    realizarConsulta(query, valores) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dataAdmin.query(query, valores);
                return result;
            }
            catch (error) {
                console.error('Error al realizar la consulta:', error);
                throw error;
            }
        });
    }
}
/*
import Pool from 'pg-pool';

const dataAdmin = new Pool({
  user: 'postgres',
  host: 'localhost',//186.4.226.49',
  port: 5432,
  database: 'admin_fulltime',
  password: '12345'
})

dataAdmin.query('SELECT NOW()', (err, res) => {
  if(err){
    console.log("Error durante la conexión", err)
  } else {
    console.log("Conexión exitosa base admin_fulltime")
  }
})*/
exports.default = DataAdmin;
