const express = require('express');
const app = express();
const passport = require('passport'); //passport tiene muchas formas de autenticacion(vienen por separado)
const localStrategy = require('passport-local').Strategy; //strategias = metodos de autenticacion (para este caso metodo loca)

const User = require('../components/users/model'); //Se trae el modelo de usuario porque para autenticarse (signin y sigup) se necesita la base de datos

//------------- Cookies ---------------
passport.serializeUser((user, done) => { //El servidor recibo el usuario actual y lo serializa
    done(null, user.id); //El servidor guarda el id del usuario actual en la cookie del navegador
});

passport.deserializeUser(async(id, done) => { //El servidos recibe la cookie del navegador y obtiene la informacion previamente serializada
    const user = await User.findById(id); // El servidor busca si la id de la cookie existe y su usuario 
    done(null, user); // Se regresa el usuario a passport
});


// recibe un objeto y tiene un callback
passport.use('localSignIn', new localStrategy({
        usernameField: 'email', //username le dice a traves de que dato se autentica el usuario
        passwordField: 'password',
        passReqToCallback: true, // permite recibir mas cosas que solo el email
    }, async(req, email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            //req.flash('error_msg', 'Usuario no encontrado');
            return done(null, false); // (err, user para cookie)
        }
        const pass = await user.equalPassword(password);
        if (!pass) {
            //req.flash('error_msg', 'Contraseña incorrecta');
            return done(null, false);
        }
        return done(null, user);

}));