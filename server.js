require("dotenv").config()
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHundler = require("./middleware/errorHundler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions");

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, "public")))

app.use('/', require("./routes/root"))
app.use('/users', require("./routes/usersRoutes"))
app.use('/notes', require('./routes/notesRoutes'))

app.all("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
})

app.use(errorHundler)

mongoose.connection.once("open", () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running in port ${PORT}`);
    })
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog')
})