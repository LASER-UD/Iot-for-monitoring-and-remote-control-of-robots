const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}

appCtrl.loriot = (req, res) => {
    res.render('index.hbs');
}

module.exports = appCtrl;