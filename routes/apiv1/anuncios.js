'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/**
 * GET /anuncios
 * Obtener una lista de anuncios
 */
router.get('/', async (req, res, next) => {
    try{
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        const fields = req.query.fields;

        //creo el filtro
        const filter = {};

        const rows = await Anuncio.list(filter, limit, skip, sort, fields);
        res.json({success: true, result: rows});
    }
    catch(err){
        next(err);
    }
});

/**
 * POST /anuncios
 * Crea un anuncio
 */
router.post('/', (req, res, next) => {
    const anuncio = new Anuncio(req.body);
    //lo persistimos en la colección de anuncios
    anuncio.save((err, anuncioGuardado) => {
        if(err){
            next(err);
            return;
        }
        res.json({ success: true, result: anuncioGuardado});
    })
});

module.exports = router;