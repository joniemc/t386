const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;

app.use(express.json());

function readUsers() {
    const data = fs.readFileSync('Usuarios.json', 'utf-8');
    return JSON.parse(data);
}

function saveUser(users){
    fs.writeFileSync('Usuarios.json',JSON.stringify(users,null,2));
}

// BLOQUE DE CODIGO PARA LAS RUTAS
app.get('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    res.json({ username: 'jperez', id: '1', password: '1234' });
});

app.get('/usuarios', (req, res) => {
    res.status(200).json({ status: 200, message: 'Success', data: readUsers() });
});

app.post('/usuarios', (req, res) => {
    const usuario = req.body;
    const usuarios = readUsers();
    usuarios.push(usuario);
    saveUser(usuarios);
    res.json({ status:200,message: 'Registro exitoso..', data: usuario });
});

app.put('/usuarios',(req,res)=>{
    
    const usuario = req.body;
    const usuarios = readUsers();
    let exists = false;
    usuarios.forEach(user => {
        if(user.id === usuario.id){
            exists = true;
            user.username = usuario.username;
            user.email = usuario.email;
            user.celphone = usuario.celphone;
            user.password = usuario.password;
        }
    });

    if(exists){
        saveUser(usuarios);
        res.status(200).json({status:200, message: 'Registro actualizado con exito..', data:usuario});
    }else{
        res.status(400).json({status:400, message: 'Registro no encontrado..', data:null});
    }

});

app.delete('/usuarios/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const usuarios = readUsers();

    const filtroUsuarios = usuarios.filter(u => u.id !== id);

    if(filtroUsuarios.length !== usuarios.length){
        saveUser(filtroUsuarios);
        res.status(200).json({status:200, message: 'Registro eliminado con exito..', data:null});
    }else{
        res.status(400).json({status:400, message: 'Registro no encontrado..', data:null});
    }

});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});