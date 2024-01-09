import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import Pool from 'pg-pool';
import pool from '../../database';
import DataAdmin from '../../database_adminFull';


class ConexionDataBasesControlador {

  // METODO PARA OPTENER EL NOMBRE DE LA BASE DE DATOS
  public async setDatabaseName(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    console.log('nombre base - : ',nombre);

    const dataBase = new DataAdmin('admin_fulltime');
    dataBase.conectar();

    try {
      const resultado = await dataBase.realizarConsulta( 
      `
      SELECT * FROM empresa as emp
      WHERE emp.nombre_database = $1
      `,[nombre]);
      console.log('resultado.rowCount: ',resultado.rowCount)
      if (resultado.rowCount > 0) {
          return res.status(200).jsonp(resultado.rows);
      }
      else {
        await pool.end();
        return res.status(404).jsonp({ text: 'Registros no encontrados.' });
      }

    } catch (error) {
      await pool.end();
      return res.status(500).jsonp({ 'problemas de conexion al servidor': 'error' })
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

  }


}

export const CONEXION_DATABASES_CONTROLADOR = new ConexionDataBasesControlador();

export default CONEXION_DATABASES_CONTROLADOR;