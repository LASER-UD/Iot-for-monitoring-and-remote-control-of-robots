const express = require('express');
const passport = require('passport');

const router = express.Router();

const user = require('../controllers/users'); //Trae los controladores de usuarios

router.get('/login', user.login);
router.get('/signup', user.signup);
router.get('/forgot', user.forgot);

router.post('/api/signup', user.apiSignup);
router.post('/api/email', user.email);
router.post('/api/username', user.username);
router.get('/logout', user.logout);

router.post('/api/login', passport.authenticate('mercury-signin', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    passReqToCallback: true, //Config para pasar los datos recibidos por el formulario
}));


module.exports = router;