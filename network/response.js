const success = (req, res, messages, status) => { 
    console.log(status)
    res.status(status || 200).send({
        'error':'',
        'data':messages
    })
}

const error = (req, res, error, status, message)=>{
    console.error(`[response error] ${message}`)
    res.status(status || 500).send({
        'error':error,
        'data':''
    })
}

module.exports = {success, error};