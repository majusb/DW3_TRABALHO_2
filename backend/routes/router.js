const express = require("express");
const routerApp = express.Router();

//importa controllers
const appPaciente = require("../apps/paciente/controller/ctlPaciente");
const appMedico = require("../apps/medico/controller/ctlMedico");
const appLogin = require("../apps/login/controller/ctlLogin");

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Pacientes
    routerApp.get("/getAllPaciente", appPaciente.GetAllPaciente);
    routerApp.get("/getPacienteByID/:pacienteid", appLogin.AutenticaJWT, appPaciente.GetPacienteByID);
    routerApp.post("/insertPaciente", appLogin.AutenticaJWT, appPaciente.InsertPaciente);
    routerApp.put("/updatePaciente/:pacienteid", appLogin.AutenticaJWT, appPaciente.UpdatePaciente);
    routerApp.delete("/deletePaciente/:pacienteid", appLogin.AutenticaJWT, appPaciente.DeletePaciente);

    //@ Rotas de Medicos
    routerApp.get("/getAllMedico", appMedico.GetAllMedico);
    routerApp.get("/getMedicoByID/:medicoid", appLogin.AutenticaJWT, appMedico.GetMedicoByID);
    routerApp.post("/insertMedico", appLogin.AutenticaJWT, appMedico.InsertMedico);
    routerApp.put("/updateMedico/:medicoid", appLogin.AutenticaJWT, appMedico.UpdateMedico);
    routerApp.delete("/deleteMedico/:medicoid", appLogin.AutenticaJWT, appMedico.DeleteMedico); 

    //@ Rotas de Consulta

    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    module.exports = routerApp;