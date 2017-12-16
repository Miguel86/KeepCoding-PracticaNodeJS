'use strict';

const express = require('express');
const router = express.Router();
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const i18n = require("i18n");

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
            console.log("Password: "+rows.toObject().clave);
            console.log("Clave cifrado: "+process.env.JWT_SECRET);
            console.log("Clave escrita: "+password);

            bcrypt.compare(password, rows.toObject().clave).then(function(rescomparar) {
                if(rescomparar == true){
                    console.log("La clave coincide...");
                    
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
                else{
                    res.status(401).json({success: false, error: 'Credenciales incorrectas'});                    
                }
            });            
        }
        else{
            res.status(401).json({success: false, error: 'Credenciales incorrectas'}); 
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
    const lang	= req.body.lang || req.query.lang || req.get("Accept-Language");
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
        console.log("Idioma: "+ lang);

        const rows = await Usuario.poremail(filter);
        if(!nombre || !email || !clave){
            res.status(401).json({success: false, error: i18n.__({phrase: 'MANDATORY_FIELDS_REGISTRATION', locale: 'es'})}); 
            return;
        }
        else if(rows){
            res.status(401).json({success: false, error: i18n.__({phrase: 'EMAIL_ALREADY_EXIST', locale: 'es'})}); 
            return;
        }
        else{
            const usuario = new Usuario(req.body);
            bcrypt.hash(usuario.clave, 10, function(err, hash) {
                if(err){
                    next(err);
                }

                usuario.clave = hash;

                //lo persistimos en la colección de usuarios
                usuario.save((err, usuarioGuardado) => {
                    if(err){
                        next(err);
                        return;
                    }
                    res.json({ success: true, result: usuarioGuardado});
                })
            });
        }
    }
    catch(err){
        next(err);
    }
});
module.exports = router;