const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

//obtener categorias
app.get('/categoria', (req, res) =>{

    Categoria.find({})
        .sort('descripcion') // ordernar de manera ascendente
        .populate('usuario', 'nombre email') //carga información de otras tablas mediante el object id
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        })

});

//obtener categorias x ID
app.get('/categoria/:id', (req, res) =>{


    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//crear nueva categorias
app.post('/categoria',verificaToken, (req, res) =>{

    //regresa nueva categoria
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if(err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    })

});

//actualizar categorias
app.put('/categoria/:id',verificaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


//delete categorias
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });


});


module.exports = app;