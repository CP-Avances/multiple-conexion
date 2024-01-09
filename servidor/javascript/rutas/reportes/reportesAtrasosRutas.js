"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
const reportesAtrasosControlador_1 = __importDefault(require("../../controlador/reportes/reportesAtrasosControlador"));
class ReportesAtrasosRutas {
    constructor() {
        this.router = (0, express_1.Router)();
        this.configuracion();
    }
    configuracion() {
        // REPORTES DE ATRASOS
        this.router.put('/atrasos-empleados/:desde/:hasta', verificarToken_1.TokenValidation, reportesAtrasosControlador_1.default.ReporteAtrasos);
        this.router.put('/atrasos-empleados-regimen-cargo/:desde/:hasta', verificarToken_1.TokenValidation, reportesAtrasosControlador_1.default.ReporteAtrasosRegimenCargo);
    }
}
const REPORTES_ATRASOS_RUTAS = new ReportesAtrasosRutas();
exports.default = REPORTES_ATRASOS_RUTAS.router;
