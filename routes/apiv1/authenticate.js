'use strict';

const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');

const jwt = require('jsonwebtoken');

router.post('/authenticate', async (req, res, next) =>{
    //recogemos las credenciales
    const email = req.body.email;
    const password = req.body.password;

    //Buscamos en la base de datos en usuario
    try{
        //creo el filtro
        const filter = {};
        if(email){
            filter.email = email;
        }      

        const rows = await Usuario.poremail(filter);
        
        if(rows.toObject()){
            console.log("Nombre: "+rows.toObject().nombre);
            console.log("Password: "+rows.toObject().password);
            console.log("Clave cifrado: "+process.env.JWT_SECRET);
            if(rows.toObject().clave !== password){
                res.status = 401;
                res.json({error: 'Credenciales incorrectas.'});
                return;    
            }
            else{
                const user = {_id: rows.toObject()._id};

                //Si el usuario existe y la password coincide
                //creamos un token 
                //No firmamos objetos de mongoose, mejor un nuevo objeto sólo con lo mínimo.
                jwt.sign({user_id: user._id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }, (err, token) =>{
                    if(err){
                        next(err);
                        return;
                    }
                    //lo devolvemos
                    res.json({success: true, token: token});
                });
            }
        }
        else{
            res.status = 401;
            res.json({error: 'Credenciales incorrectas.'});
            return;
        }
    }
    catch(err){
        next(err);
    }
});

router.post('/registro', async (req, res, next) =>{
    //recogemos las credenciales
    const nombre = req.body.nombre;
    const email = req.body.email;
    const clave = req.body.clave;

    //Buscamos en la base de datos en usuario
    try{
        //creo el filtro
        const filter = {};
        if(email){
            filter.email = email;
        }      

        console.log("Nombre: "+nombre);
        console.log("Password: "+clave);
        console.log("Email: "+email);

        const rows = await Usuario.poremail(filter);
        if(!nombre || !email || !clave){
            res.status = 401;
            res.json({success: false, error: 'Los campos nombre, clave y email son obligatorios.'});
            return;
        }
        else if(rows){
            res.status = 401;
            res.json({success: false, error: 'Ya existe este email en la base de datos.'});
            return;
        }
        else{
            const usuario = new Usuario(req.body);
            //lo persistimos en la colección de anuncios
            usuario.save((err, usuarioGuardado) => {
                if(err){
                    next(err);
                    return;
                }
                res.json({ success: true, result: usuarioGuardado});
            })
        }
    }
    catch(err){
        next(err);
    }
});
module.exports = router;