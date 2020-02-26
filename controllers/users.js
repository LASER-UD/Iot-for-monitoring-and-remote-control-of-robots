const User = require('../models/user');

const userCtrl = {};

userCtrl.login = (req, res) => {
    res.render('users/login.hbs')
}

userCtrl.signup = (req, res) => {
    res.render('users/signup.hbs')
}

userCtrl.forgot = (req, res) => {
    res.send('Olvide contarseña');
}

userCtrl.apiSignup = async(req, res) => {
    const { username, name, lastName, email, password } = req.body; //Destructuring 
    try {
        const newUser = new User({
            username: username,
            name: name,
            lastName: lastName,
            email: email,
            password: ''
        })
        newUser.password = await newUser.encriptarPassword(password);
        await newUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
            .then(data => {
                res.json({ saved: true });
            })
            .catch(e => {
                res.json({ saved: false });
            })
    } catch (e) {
        res.json({ saved: false });
    }
}

userCtrl.email = async(req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        user ? res.json({ user: true }) : res.json({ user: false });

    } catch (e) {
        res.json({ user: false, error: e });
    }
}
userCtrl.username = async(req, res) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username });
        user ? res.json({ user: true }) : res.json({ user: false });

    } catch (e) {
        res.json({ user: false, error: e });
    }
}

module.exports = userCtrl;