const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}


module.exports = appCtrl;