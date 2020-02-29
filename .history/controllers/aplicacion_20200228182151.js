const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}

appCtrl.loriot = (req, res) => {
    if(req.body.data !=undefined){
        var datos = hex_to_ascii(req.body.data);
    }
    

}

module.exports = appCtrl;