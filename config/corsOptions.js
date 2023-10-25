const allowedList = require("./allowedList")

const corsOptions = {

    origin: (origin, callback) => {
        if(allowedList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error("No Allow By Cors"))
        }
    },
    credentials : true,
    optionSuccessStatus: 200

}

module.exports = corsOptions