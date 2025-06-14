const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const PORT = process.env.PORT;

require('dotenv').config();

//importando los archivos que necesitamos con la configuración de las rutas
const authLogin = require('./routes/authLogin');

// npm install jsonwebtoken -> sirve para implementar seguridad en las APIs por jwt, generamos token y validamos
// npm install bcrypt -> para encriptar contraseñas

app.use(express.json());


app.use('/', authLogin);

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