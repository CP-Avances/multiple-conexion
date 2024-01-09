import { Request, Response } from 'express';
import { QueryResult } from "pg";
import fs from 'fs';
import pool from '../../database';
const builder = require('xmlbuilder');

class HorasExtrasControlador {
  public async ListarHorasExtras(req: Request, res: Response) {
    const HORAS_EXTRAS = await pool.query('SELECT * FROM cg_hora_extras');
    if (HORAS_EXTRAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaHoraExtra(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const HORAS_EXTRAS = await pool.query('SELECT * FROM cg_hora_extras WHERE id = $1', [id]);
    if (HORAS_EXTRAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearHoraExtra(req: Request, res: Response) {
    const { descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo,
      incl_almuerzo, tipo_funcion } = req.body;
    const response: QueryResult = await pool.query(
      `
      INSERT INTO cg_hora_extras ( descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, 
        tipo_dia, codigo, incl_almuerzo, tipo_funcion ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
      `
      , [descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion]);

    const [HORA] = response.rows;

    if (HORA) {
      return res.status(200).jsonp(HORA);
    } else {
      return res.status(404).jsonp({ message: "error" });
    }
  }

  public async EliminarRegistros(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await pool.query('DELETE FROM cg_hora_extras WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado.' });
  }

  public async ActualizarHoraExtra(req: Request, res: Response): Promise<void> {
    const { descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion, id } = req.body;
    await pool.query('UPDATE cg_hora_extras SET descripcion = $1, tipo_descuento = $2, reca_porcentaje = $3, hora_inicio = $4, hora_final = $5, hora_jornada = $6, tipo_dia = $7, codigo = $8, incl_almuerzo = $9, tipo_funcion = $10 WHERE id = $11', [descripcion, tipo_descuento, reca_porcentaje, hora_inicio, hora_final, hora_jornada, tipo_dia, codigo, incl_almuerzo, tipo_funcion, id]);
    res.jsonp({ message: 'Hora extra actualizada' });
  }

}

export const horaExtraControlador = new HorasExtrasControlador();

export default horaExtraControlador;