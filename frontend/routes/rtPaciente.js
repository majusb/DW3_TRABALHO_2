    // Conteúdo do arquivo routes/rtPaciente.js
    var express = require('express');
    var router = express.Router();

    //-- /paciente -> a tela da tabela
    router.get('/', function(req, res) {
    res.render('paciente/vwLstPaciente', {
        title: 'Paciente',
        showNavbar: true,
        activeMenu: 'Paciente',
        servidorTrabalho: process.env.SERVIDOR_DW3 // É necessário, pois o front em html não tem acesso ao .env
    });
    });

    //-- /paciente/form -> a tela de cadastro
    router.get('/form', function(req, res) {
    res.render('paciente/vwFormPaciente', {
        title: 'Formulario de paciente',
        showNavbar: true,
        activeMenu: 'Paciente',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
    });

    module.exports = router;