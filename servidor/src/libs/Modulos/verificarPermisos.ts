import { NextFunction, Request, Response } from 'express';

export const ModuloPermisosValidation = (req: Request, res: Response, next: NextFunction) => {

    const { permisos } = req.modulos;
    console.log('******************** validacion de modulo de permisos', permisos);

    if (!permisos) return res.status(401).jsonp({
        access: false,
        title: `Ups!!! al parecer no tienes activado en tu plan el Módulo de Permisos. \n`,
        message: '¿Te gustaría activarlo? Comunícate con nosotros.',
        url: 'www.casapazmino.com.ec'
    })

    console.log('******************** si tiene acceso modulo de permisos', permisos);
    next()
}