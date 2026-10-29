    // Conteúdo do arquivo routes/rtMedico.js
    var express = require('express');
    var router = express.Router();

    //-- /medico -> a tela da tabela
    router.get('/', function(req, res) {
    res.render('medicos/vwLstMedico', {
        title: 'Médico',
        showNavbar: true,
        activeMenu: 'Medico',
        servidorTrabalho: process.env.SERVIDOR_DW3 // É necessário, pois o front em html não tem acesso ao .env
    });
    });

    //-- /medico/form -> a tela de cadastro
    router.get('/form', function(req, res) {
    res.render('medicos/vwFormMedico', {
        title: 'Formulario de médicos',
        showNavbar: true,
        activeMenu: 'Medico',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
    });

    module.exports = router;