const express = require('express');
const mysql = require('mysql2'); // importamos la libreria
const app = express();
const PORT = 3000;

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

app.post('/api/libros', (req, res)=>{
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

app.put('/api/libros',(req,res)=>{
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

app.delete('/api/libros/:codigo',(req, res)=>{
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