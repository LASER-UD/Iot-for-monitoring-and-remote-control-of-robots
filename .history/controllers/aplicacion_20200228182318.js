const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}

appCtrl.loriot = (req, res) => {
    if(req.body.data !=undefined){
        datos = req.body.data;
        console.log(datos);
    }
}

module.exports = appCtrl;