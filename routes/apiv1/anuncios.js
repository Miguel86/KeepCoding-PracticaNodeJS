'use strict'
var debug = require('debug')('nodepop:server')
const express = require('express')
const router = express.Router()
const Anuncio = require('../../models/Anuncio')

const jwtAuth = require('../../lib/jwtAuths')
router.use(jwtAuth())

/**
 * GET /anuncios/tags
 * Obtener una lista de anuncios
 */
router.get('/tags', async (req, res, next) => {
  try {
    debug('Listando tags')
    const rows = await Anuncio.listTags()
    res.json({success: true, result: rows})
  } catch (err) {
    next(err)
  }
})

/**
 * GET /anuncios
 * Obtener una lista de anuncios
 */
router.get('/', async (req, res, next) => {
  try {
    debug('Obteniendo lista de anuncios')
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.start)
    const sort = req.query.sort
    const fields = req.query.fields
    const tipoAnuncio = req.query.venta
    const tag = req.query.tag

    const nombreAnuncio = req.query.nombre
    const precio = req.query.precio

    // creo el filtro
    const filter = {}
    if (nombreAnuncio) {
      filter.nombre = new RegExp('^' + nombreAnuncio, 'i')
    }
    if (precio) {
      const precioArr = precio.split('-')
      if (precioArr.length === 1) {
        filter.precio = precio
      } else if (precioArr.length === 2) {
        if (precioArr[0] !== '' && precioArr[1] === '') { // Precio del tipo 50-
          filter.precio = { '$gte': precioArr[0] }
        } else if (precioArr[0] === '' && precioArr[1] !== '') { // Precio del tipo -50
          filter.precio = { '$lte': precioArr[1] }
        } else if (precioArr[0] !== '' && precioArr[1] !== '') { // Precio del tipo 50-60
          filter.precio = {'$gte': precioArr[0], '$lte': precioArr[1]}
        }
      }
    }
    if (tipoAnuncio) {
      filter.venta = tipoAnuncio
    }
    if (tag) {
      filter.tags = tag
    }
    const rows = await Anuncio.list(filter, limit, skip, sort, fields)
    res.json({success: true, result: rows})
  } catch (err) {
    next(err)
  }
})

/**
 * POST /anuncios
 * Crea un anuncio
 */
router.post('/', (req, res, next) => {
  try {
    debug('Publicando un nuevo anuncio')
    const anuncio = new Anuncio(req.body)
    // lo persistimos en la colección de anuncios
    anuncio.save((err, anuncioGuardado) => {
      if (err) {
        next(err)
        return
      }
      res.json({success: true, result: anuncioGuardado})
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
