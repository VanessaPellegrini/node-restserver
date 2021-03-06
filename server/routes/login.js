const express = require('express');

const app = express();

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario* o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña* incorrectos'
                }
            })
        }

        //obtenemos el payload
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN  })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token //no es necesario volver a escribirlo
            //el token debe ser guardado en el front > localstorage
        })
    })

});



module.exports = app;