const express = require('express');
const router = express.Router();// Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response')//Trae network dos carpetas arriba
const passport = require('passport');

//----- Comprueba Paswords----
router.post('/login', passport.authenticate('localSignIn', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        passReqToCallback: true,
    })
);

//-------Comprueba User Name
router.post('/username', (req,res)=>{
    const userName = req.body.userName
    controller.isUserName(userName)
        .then((info)=>{
            response.success(req, res, info, 200)
        })
        .catch((e)=>{
            response.error(req, res, 'Error Inesperado',300,e)
        })
})

//--------Comprueba Email
router.post('/email',(req,res)=>{
    const email = req.body.email;
    controller.isEmail(email)
        .then((info)=>{
            response.success(req, res, info, 200)
        })
        .catch((e)=>{
            response.error(req, res, 'Error Inesperado',300,e)
        })
})

//------ Nuevo usuario
router.post('/',(req, res) => {
    const { userName, name, lastName, email, password } = req.body; //Destructuring 
    controller.addUser(userName,name, lastName,email,password)
        .then((info)=>{
            response.success(req, res, info, 201)
        })
        .catch((e)=>{
            response.error(req, res, 'Información Invalida',300,e)
        })  
})

//-----Obtener los usuarios
router.get('/',(req, res)=>{
    //Aplica Query
    const filterUser = req.query.userName || null;
    controller.getUser(filterUser)
        .then((userList)=>{
            response.success(req,res,userList,200);
        })
        .catch((e)=>{
            response.error(req,res,'Error de Registro', 500, e);
        })
})//Responde a Peticiones Get

//-----Eliminar los usuarios
router.delete('/',(req, res)=>{

})
//-----Actualizar los usuarios
router.patch('/',(req, res)=>{

})


module.exports = router;