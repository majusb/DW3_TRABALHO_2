const express = require("express");
const routerApp = express.Router();

//importa controllers
const appPaciente = require("../apps/paciente/controller/ctlPaciente");
const appMedico = require("../apps/medico/controller/ctlMedico");
const appConsulta = require("../apps/consulta/controller/ctlConsulta");
const appLogin = require("../apps/login/controller/ctlLogin");

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Pacientes
    routerApp.get("/getAllPaciente", appLogin.AutenticaJWT, appPaciente.GetAllPaciente);
    routerApp.get("/getPacienteByID/:pacienteid", appLogin.AutenticaJWT, appPaciente.GetPacienteByID);
    routerApp.post("/insertPaciente", appLogin.AutenticaJWT, appPaciente.InsertPaciente);
    routerApp.put("/updatePaciente/:pacienteid", appLogin.AutenticaJWT, appPaciente.UpdatePaciente);
    routerApp.delete("/deletePaciente/:pacienteid", appLogin.AutenticaJWT, appPaciente.DeletePaciente);

    //@ Rotas de Medicos
    routerApp.get("/getAllMedico", appLogin.AutenticaJWT, appMedico.GetAllMedico);
    routerApp.get("/getMedicoByID/:medicoid", appLogin.AutenticaJWT, appMedico.GetMedicoByID);
    routerApp.post("/insertMedico", appLogin.AutenticaJWT, appMedico.InsertMedico);
    routerApp.put("/updateMedico/:medicoid", appLogin.AutenticaJWT, appMedico.UpdateMedico);
    routerApp.delete("/deleteMedico/:medicoid", appLogin.AutenticaJWT, appMedico.DeleteMedico); 

    //@ Rotas de Consulta
    routerApp.get("/getAllConsulta", appLogin.AutenticaJWT, appConsulta.GetAllConsulta);
    routerApp.get("/getConsultaByID/:consultaid", appLogin.AutenticaJWT, appConsulta.GetConsultaByID);
    routerApp.post("/insertConsulta", appLogin.AutenticaJWT, appConsulta.InsertConsulta);
    routerApp.put("/updateConsulta/:consultaid", appLogin.AutenticaJWT, appConsulta.UpdateConsulta);
    routerApp.delete("/deleteConsulta/:consultaid", appLogin.AutenticaJWT, appConsulta.DeleteConsulta);
    
    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    module.exports = routerApp;