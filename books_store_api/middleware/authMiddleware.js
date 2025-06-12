const jwt = require('jsonwebtoken');

require('dotenv').config();

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    console.log(authHeader);

    if(!authHeader){
        return res.status(401).json({status:401, message:'Token no proporcionado...'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).json({status:401, message:'Token invalido o expirado...'});
        }

        next();
    });
};

module.exports = authMiddleware;