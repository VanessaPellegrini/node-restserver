const express = require('express');

let {verificaToken} = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria');





module.exports = app;