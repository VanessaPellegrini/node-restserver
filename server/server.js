require ('./config/config')

const express = require('express')
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('get World')
})

app.post('/usuario', function (req, res) {
    //res.json('post World')
    let body = req.body;

    //validacion de params
    if (body.nombre ===undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'Faltan algunos datos'
        })
    }
    res.json({
        persona: body
    })
})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id
    })
})

//ya no se eliminan registros, si no que se cambia el estado para que no quede disponible
app.delete('/usuario', function (req, res) {
    res.json('delete World')
})

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ' + process.env.PORT);
})