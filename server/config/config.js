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