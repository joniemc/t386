const express = require('express');
const mysql = require('mysql2'); // importamos la libreria
const app = express();
const PORT = 3000;

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'libreria'
});

pool.getConnection((error, connetion)=>{
    if(error){
        console.log('Error de conexión...');
    }
    else{
        console.log('Conexión exitosa...');
    }
});

app.get('/api/libros',(req,res)=>{
    const sql = 'select * from libro';

    pool.query(sql,(err,results)=>{
        if(err){
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });

});

app.get('/api/libros/:codigo',(req,res)=>{

    const codigo = parseInt(req.params.codigo);
    const sql = 'select * from libro where codigo = ?';

    pool.query(sql, [codigo], (err,results)=>{
        if(err){
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });

});

app.get('/api/libros/filtro/:tipo/:flag',(req,res)=>{
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

app.get('/api/libros/filtropornombre/:autor',(req,res)=>{
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
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});