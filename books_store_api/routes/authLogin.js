const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();

require('dotenv').config();

router.post('/api/login',async (req,res)=>{
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
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );

        res.status(200).json({status:200,message:'Success',token:token});
    });
});

router.get('/api/users',(req,res)=>{
    sql = "select code,username from user";
    pool.query(sql, (err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({status:500, message: 'Error en la consulta...',data:null});
        }

        res.status(200).json({status:200, message:'Success',data:results});
    });
});

module.exports = router;