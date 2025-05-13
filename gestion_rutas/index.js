const express = require('express');
const app = express();
const PORT = 3000;

const usuarios = [{
    "username":"jmiralda",
    "email":"jmiralda@unitec.edu",
    "celphone":"95069826",
    "password":"123"
}];

app.use(express.json());

// BLOQUE DE CODIGO PARA LAS RUTAS
app.get('/usuarios/:id', (req,res)=>{
    let id = req.params.id;
    console.log(id);
    res.json({username:'jperez', id:'1', password:'1234'});
});

app.get('/usuarios',(req, res)=>{
    res.status(400).json(usuarios);
});

app.post('/usuarios/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const usuario = req.body;
    usuarios.push(usuario);
    res.json({message:'Nuevo mensaje',data:usuario, id:id});
});

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});