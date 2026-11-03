// routes/rtLogin.js
var express = require('express');
var router = express.Router();

//-- /login -> mostra a tela de login (sem navbar)
router.get('/', function(req, res) {
    res.render('login', {
        title: 'Login',
        showNavbar: false,
        servidorDw3: process.env.SERVIDOR_DW3 // o front em html não tem acesso ao .env
    });
});

//-- /login (POST) -> após o login bem-sucedido o próprio JavaScript redireciona para /home
router.post('/', function(req, res) {
    res.redirect('/home');
});

module.exports = router;
