const express = require('express');
const router = express.Router();// Igual a la función Router para separar por cabeceras y metodos de petición
const session = require('../../network/auth');

router.get('/',session.isAuthenticated,(req,res)=>{
    res.render('index.hbs');
})
//--- redireciona el login
router.get('/login', (req,res)=>{
    res.render('users/login.hbs')
});
//--- redireciona el signup
router.get('/signup', (req,res)=>{
    res.render('users/signup.hbs')
});
//---   Trabajar en esto
router.get('/forgot', (req,res)=>{
    res.send('Olvide contarseña');
});
//--- cierra sesion
router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/')
});

module.exports = router;