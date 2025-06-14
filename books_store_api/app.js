const express = require('express');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT;

require('dotenv').config();

//importando los archivos que necesitamos con la configuración de las rutas
const authLogin = require('./routes/authLogin');
const libros = require('./routes/libros');

// npm install jsonwebtoken -> sirve para implementar seguridad en las APIs por jwt, generamos token y validamos
// npm install bcrypt -> para encriptar contraseñas

app.use(express.json());

app.use('/', authLogin);
app.use('/', libros);

app.get('/api/gethash/:painText', authMiddleware, async (req,res)=>{
    const plainText = req.params.painText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plainText,saltRound);

    return res.send(hash);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});