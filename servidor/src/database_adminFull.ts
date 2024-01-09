// CONEXION CON LA BASE DE DATOS POSTGRESQL
import { Client, QueryResult } from 'pg';

class DataAdmin {
  private dataAdmin: Client;

  constructor(private dbName: string) {
    this.dataAdmin = new Client({
      user: 'postgres',
      host: 'localhost',//186.4.226.49',
      port: 5432,
      database: this.dbName,
      password: '12345'
    });
  }

  
  async conectar() {
    try {
      await this.dataAdmin.connect();
      // Realiza operaciones con la base de datos
      console.log('Conexión exitosa - '+this.dbName);
    } catch (error) {
      console.error('Error al conectar:', error);
    }
  }

  async cerrarConexion() {
    try {
      await this.dataAdmin.end();
      console.log('Conexión cerrada admin_fulltime');
    } catch (error) {
      console.error('Error al cerrar la conexión: ', error);
    }
  }

  async realizarConsulta(query: string, valores: any[]): Promise<QueryResult<any>> {
    try {
      const result = await this.dataAdmin.query(query, valores);
      return result
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      throw error;
    }
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

export default DataAdmin;