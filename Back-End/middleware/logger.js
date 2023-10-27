const { format } = require('date-fns');
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { v4: uuid } = require("uuid");

let logEvents = async (message, logFileName) => {
    let logTime = format(new Date(), 'MM/dd/yyyy\tHH:MM:SS')
    let logItem = `${logTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
        }

        await fsPromises.appendFile(
            path.join(__dirname, "..", "logs", `${logFileName}.log`),
            logItem
        )

    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'First')

    console.log(req.method);
    next()
}

module.exports = { logEvents, logger }