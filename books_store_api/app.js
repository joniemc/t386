const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');
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
app.use(cors());

app.use('/', authLogin);
app.use('/', libros);

app.get('/api/gethash/:painText', authMiddleware, async (req,res)=>{
    const plainText = req.params.painText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plainText,saltRound);

    return res.send(hash);
});

app.get('/api/posts',async (req,res)=>{
    try{
        let url = process.env.ENDPOINT_API_TERCEROS+'/posts';
        console.log(url);

        const axiosResponse = await axios.get(url);
        
        // Ejemplo de uso de los datos de respuesta del api de terceros
        let posts = axiosResponse.data;
        let multiplicacion = posts[0].userId*20;
        console.log(multiplicacion);

        res.status(200).json({status:200,message:'Success',data: axiosResponse.data});
    }catch(error){
        res.status(500).json({status:500,message:'Ocurrio un error en el servidor..'});
    }
});

app.post('/api/posts',async (req,res)=>{
    const post = req.body;
    try{
        let url = process.env.ENDPOINT_API_TERCEROS+'/posts';
        console.log(url);

        const axiosResponse = await axios.post(url,post);
        console.log(axiosResponse);

        res.status(200).json({status:200,message:'Success',data: axiosResponse.data});
    }catch(error){
        res.status(500).json({status:500,message:'Ocurrio un error en el servidor..'});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});