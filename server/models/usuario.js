const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles= {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let Schema = mongoose.Schema;

//definir reglas y controllers

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'esta condicion es necesaria']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'esta condicion es necesaria']
    },
    password: {
        type: String,
        required: [true, 'esta condicion es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role:{
        //take care with the insert role
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
})

//deja de retornar el password
//exclusion de contraseña desde el modelo
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

//indicarle al esquema que usara un esquema particular
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'})

module.exports = mongoose.model('Usuario', usuarioSchema);
