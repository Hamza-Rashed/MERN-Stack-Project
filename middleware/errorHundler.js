const { logEvents } = require("./logger")

const errorHundler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t`,'ErrorLog')
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500

    res.status(status)

    res.json({'message': err.message})
}

module.exports = errorHundler