var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('consulta/vwLstConsulta', {
        title: 'Consulta',
        showNavbar: true,
        activeMenu: 'Consulta',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

router.get('/form', function(req, res) {
    res.render('consulta/vwFormConsulta', {
        title: 'Formulário de consulta',
        showNavbar: true,
        activeMenu: 'Consulta',
        servidorTrabalho: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
