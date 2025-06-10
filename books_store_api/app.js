const express = require('express');
const mysql = require('mysql2'); // importamos la libreria
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'MyClaveSecreta';

// npm install jsonwebtoken -> sirve para implementar seguridad en las APIs por jwt, generamos token y validamos
// npm install bcrypt -> para encriptar contraseñas

const pool = mysql.createPool({
    host:'localhost',
    user:'root', // remplazar por su usuario de conexión
    password:'root', // reemplazar por su contraseña
    database:'libreria' // crear la base datos con los atributos solicitados
});

pool.getConnection((error, connetion)=>{
    if(error){
        console.log('Error de conexión...');
    }
    else{
        console.log('Conexión exitosa...');
    }
});

app.use(express.json());

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    console.log(authHeader);

    if(!authHeader){
        return res.status(401).json({status:401, message:'Token no proporcionado...'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).json({status:401, message:'Token invalido o expirado...'});
        }

        next();
    });
};

app.post('/api/login',async (req,res)=>{
    const userAuth = req.body;

    if(!userAuth.username || !userAuth.password){
        return res.status(403).json({status:403,message:'Todos los campos son requeridos...'});
    }

    const sql = 'select * from user where username = ?';

    pool.query(sql,[userAuth.username],async (err, results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error en la consulta...'});
        }
        
        if(results.length === 0){
            return res.status(401).json({status:401,message:'Credenciales invalidas...'});
        }
        
        let user = results[0];
        const isMatch = await bcrypt.compare(userAuth.password,user.password);

        if(!isMatch){
            return res.status(401).json({status:401,message:'Credenciales invalidas...'});
        }

        //Crear Token
        const token = jwt.sign(
            {username: user.username},
            SECRET_KEY,
            {expiresIn: '1h'}
        );

        res.status(200).json({status:200,message:'Success',token:token});
    });
});

app.get('/api/gethash/:painText', authMiddleware, async (req,res)=>{
    const plainText = req.params.painText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plainText,saltRound);

    return res.send(hash);
});

app.get('/api/libros', authMiddleware, (req,res)=>{
    const sql = 'select * from libro';

    pool.query(sql,(err,results)=>{
        if(err){
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });

});

app.get('/api/libros/:codigo', authMiddleware,(req,res)=>{

    const codigo = parseInt(req.params.codigo);
    const sql = 'select * from libro where codigo = ?';

    pool.query(sql, [codigo], (err,results)=>{
        if(err){
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });

});

app.get('/api/libros/filtro/:tipo/:flag', authMiddleware, (req,res)=>{
    const flag = req.params.flag;
    const tipo = parseInt(req.params.tipo);
    if(tipo === 1){
        const sql = 'select * from libro where codigo = ?';

        pool.query(sql,[parseInt(flag)],(err,results)=>{
            if(err){
                return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
            }

            res.status(200).json({status:200, message:'Success',data:results});
        });    
    }
    else{

        const sql = "select * from libro where autor like ?";

        pool.query(sql,[flag],(err,results)=>{
            if(err){
                console.error(err);
                return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
            }

            res.status(200).json({status:200, message:'Success',data:results});
        });
    }
    
});

app.get('/api/libros/filtropornombre/:autor', authMiddleware, (req,res)=>{
    const autor = req.params.autor;
    const sql = "select * from libro where autor like ?";

    pool.query(sql,[autor],(err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });

});

app.post('/api/libros', authMiddleware, (req, res)=>{
    const libro = req.body;

    const sql = "insert into libro (titulo,autor,anio) values(?,?,?)";
    pool.query(sql,[libro.titulo,libro.autor,libro.anio],(err,results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error al insertar el registro...',data:null});
        }

        libro.codigo = results.insertId;
        return res.status(201).json({status:201,message:'Registro exitoso...',data:libro});
    });

});

app.put('/api/libros', authMiddleware, (req,res)=>{
    const libro = req.body;

    const sql = 'update libro set titulo=?, autor=?, anio=? where codigo = ?';
    pool.query(sql,[libro.titulo,libro.autor,libro.anio,libro.codigo],(err,results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error al actualizar el registro...',data:null});
        }

        if(results.affectedRows === 0){
            return res.status(403).json({status:403,message:'Registro no encontrado...',data:null});
        }

        res.status(200).json({status:200,message:'',data:libro});

    });
});

app.delete('/api/libros/:codigo', authMiddleware, (req, res)=>{
    const codigo = parseInt(req.params.codigo);

    const sql = 'delete from libro where codigo=?';

    pool.query(sql,[codigo],(err,results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error al eliminar el registro...',data:null});
        }

        if(results.affectedRows === 0){
            return res.status(403).json({status:403,message:'No se encontro el registro...',data:null});
        }

        return res.status(200).json({status:200,message:'Registro eliminado exitosamente...',data:null});

    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});