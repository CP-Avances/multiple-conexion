export interface HorarioTimbre{
    fec_hora_timbre: string,
    accion: string,
    tecl_funcion: string,
    observacion: string,
    latitud: string,
    longitud: string,
    id: number,
    id_empleado: number,
    id_reloj: number,
    empl_id: number,
    codigo: string,
    cargo_id: number,
    contrato_id: number,
    estado_empl: number,
    id_horarios: number,
    nom_horario: string,
    minu_espera: number,
    tipo_accion: string,
    hora: string,
    fec_inicio: Date,
    fec_final: Date,
    horario_horas: string,
    cargo_horas: number,
    cargo: number,
    id_cargo: number,
    hora_total: string
    novedades_conexion: string
}

export interface EntradasSalidas {
    fec_hora_timbre: string,
    accion: string | null,
    tecl_funcion: string | null,
    observacion: string,
    latitud: string,
    longitud: string,
    id: number,
    id_empleado: number,
    id_reloj: number,
    empl_id: number,
    codigo: string,
    cargo_id: number,
    contrato_id: number,
    estado_empl: number,
    id_horarios: number,
    nom_horario: string,
    minu_espera: number,
    tipo_accion: string,
    hora: string,
    fec_inicio: string,
    fec_final: string,
    horario_horas: string,
    cargo_horas: number,
    cargo: number,
    id_cargo: number,
    hora_total: string,
    novedades_conexion: string
}