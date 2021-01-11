
//also called controller
const express = require('express');

//libreria para encriptar contraseña
const bcrypt = require('bcrypt');

//libreria para elegir que valores del body se van a sobre-escribir
const _ = require('underscore');


const app = express();

const Usuario = require('../models/usuario');

//consulta
// /usuario?limit=10&from=10

app.get('/usuario', function (req, res) {

    //paginacion desde
    let from = req.query.from || 0;
    //lo transforma en number porque espera un string
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number (limit);

    //Usuario.find({ google: true})
    //filtrando información de un get Usuario.find({}, 'nombre email') filtrará esos dos datos
    Usuario.find({ estado: true})
        .skip(from)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            //retornar numero total de registros de una coleccion
            //{ google: true}
            Usuario.count({ estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteos: conteo
                })
            })

        });
})

app.post('/usuario', function (req, res) {
    //res.json('post World')
    let body = req.body;

    //instancia del schema
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //encripta la contraseña
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        //bad request
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //si todo es correcto
        //status 200 implicito
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

//actualizar
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /* WARNING** NO funciona cuando son muchos objetos
        delete body.password;
        delete body.google; */

    //actualiza bd
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

//ya no se eliminan registros, si no que se cambia el estado para que no quede disponible 
//para mantener la integridad referencial
//se puede realizar mandando un post, dentro del body pasando el id
app.delete('/usuario/:id', function (req, res) {
    
    let id= req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //en caso de eliminar registro
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        //evaluar el error en la eliminacion
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })


    })


})

module.exports = app;