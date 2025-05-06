const express = require('express');
const app = express();
const PORT = 3000;

// BLOQUE DE CODIGO PARA LAS RUTAS
app.get('/usuarios/:id', (req,res)=>{
    let id = req.params.id;
    console.log(id);
    res.json({username:'jperez', id:'1', password:'1234'});
});

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});