'use strict'
var debug = require('debug')('nodepop:server')
const express = require('express')
const router = express.Router()
const Usuario = require('../../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
/**
 * POST /usuarios/authenticate
 * Autentica a un usuario en el sistema
 */
router.post('/authenticate', async (req, res, next) => {
  // recogemos las credenciales
  const email = req.body.email
  const password = req.body.password

  // Buscamos en la base de datos en usuario
  try {
    debug('Autenticando un usuario')
    // creo el filtro
    const filter = {}
    if (email) {
      filter.email = email
    }

    const rows = await Usuario.poremail(filter)

    if (rows.toObject()) {
      // Devolvio un usuario con ese email, vamos a validar la contraseña
      bcrypt.compare(password, rows.toObject().clave).then(function (rescomparar) {
        if (rescomparar === true) {
          debug('Clave correcta, adelante!')

          const user = {_id: rows.toObject()._id}

          // Si el usuario existe y la password coincide
          // creamos un token
          // No firmamos objetos de mongoose, mejor un nuevo objeto sólo con lo mínimo.
          jwt.sign({user_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          }, (err, token) => {
            if (err) {
              next(err)
              return
            }
            // lo devolvemos
            res.json({success: true, token: token})
          })
        } else {
          debug('Clave incorrecta, fuera!')
          res.status(401).json({success: false, error: res.__('INVALID_PASSWORD')})
        }
      })
    } else { // No existe ningun usuario con ese email
      res.status(401).json({success: false, error: res.__('INVALID_PASSWORD')})
    }
  } catch (err) {
    next(err)
  }
})

/**
 * POST /usuarios/registro
 * Registra a un nuevo usuario en el sistema.
 */
router.post('/registro', async (req, res, next) => {
  // recogemos las credenciales
  const nombre = req.body.nombre
  const email = req.body.email
  const clave = req.body.clave

  // Buscamos en la base de datos en usuario
  try {
    // creo el filtro
    const filter = {}
    if (email) {
      filter.email = email
    }

    console.log('Nombre: ' + nombre)
    console.log('Password: ' + clave)
    console.log('Email: ' + email)

    const rows = await Usuario.poremail(filter)
    if (!nombre || !email || !clave) {
      res.status(401).json({success: false, error: res.__('MANDATORY_FIELDS_REGISTRATION')})
      return
    } else if (rows) {
      res.status(401).json({success: false, error: res.__('EMAIL_ALREADY_EXIST')})
      return
    } else {
      const usuario = new Usuario(req.body)
      bcrypt.hash(usuario.clave, 10, function (err, hash) {
        if (err) {
          next(err)
        }

        usuario.clave = hash

        // lo persistimos en la colección de usuarios
        usuario.save((err, usuarioGuardado) => {
          if (err) {
            next(err)
            return
          }
          res.json({success: true, result: usuarioGuardado})
        })
      })
    }
  } catch (err) {
    next(err)
  }
})
module.exports = router
