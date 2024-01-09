import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import Pool from 'pg-pool';
import DataAdmin from '../../database_adminFull';




class ConexionDataBasesControlador {

  // METODO PARA OPTENER EL NOMBRE DE LA BASE DE DATOS
  public async setDatabaseName(req: Request, res: Response): Promise<any> {
    //De acuerdo a la configuracion de la base de datos envio como parametro pero desde el controlador el nombre de la base de datos a conectar
    const dataBase = new DataAdmin('admin_fulltime');
    dataBase.conectar();//inicia la conexion a la base dedatos

    const { nombre } = req.params;//toma el nombre de la tabla enviada desde el servicio de frontend
    console.log('nombre base - : ',nombre);

    try {
      const resultado = await dataBase.realizarConsulta( 
      `
      SELECT * FROM empresa as emp
      WHERE emp.nombre_database = $1
      `,[nombre]);
     
      if (resultado.rowCount > 0) {
          return res.status(200).jsonp(resultado.rows);
      }
      else {
        return res.status(404).jsonp({ text: 'Registros no encontrados.' });
      }

    } catch (error) {
      return res.status(500).jsonp({ 'problemas de conexion al servidor': 'error' })
    }finally{
      dataBase.cerrarConexion();
    }

  }


}

export const CONEXION_DATABASES_CONTROLADOR = new ConexionDataBasesControlador();

export default CONEXION_DATABASES_CONTROLADOR;