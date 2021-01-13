const config = require('./config/config')

const express = require('express')
const app = express();


const mongoose = require('mongoose');


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//referencia de las rutas habilitadas - conf global de rutas
app.use(require("./routes/index"))

/* app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ' + process.env.PORT);
}) */
const { url } = config.dataBase;
const port = config.port;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(
    () => {
        console.log('base de datos online');
        app.listen(port, () => {
            console.log(`Escuchando el puerto --> ${port} - `);
        });
    }
).catch(err => console.log((err)));
