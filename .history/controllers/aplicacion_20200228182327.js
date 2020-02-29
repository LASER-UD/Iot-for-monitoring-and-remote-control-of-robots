const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}

appCtrl.loriot = (req, res) => {
    if(req.body.data !=undefined){
        var datos = req.body.data;
        console.log(datos);
    }
}

module.exports = appCtrl;