const mysql = require('mysql2');


require('dotenv').config();

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER, // remplazar por su usuario de conexión
    password:process.env.DB_PASSWORD, // reemplazar por su contraseña
    database:process.env.DB_NAME // crear la base datos con los atributos solicitados
});

pool.getConnection((error, connetion)=>{
    if(error){
        console.log('Error de conexión...');
    }
    else{
        console.log('Conexión exitosa...');
    }
});

module.exports = pool;