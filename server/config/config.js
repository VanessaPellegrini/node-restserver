//objeto global que siempre esta corriendo

//========================
// Puerto
//========================


module.exports = {
    name: 'cafe',
    port: process.env.PORT = process.env.PORT || 3001,
    dataBase: {
        url: 'mongodb://localhost:27017/cafe'
    }
}

//========================
// VENCIMIENTO TOKEN
//========================

//60 segundos 60 min * 24 hs * 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//========================
// SEED
//========================

process.env.SEED = process.env.SEED || 'seed desarrollo';