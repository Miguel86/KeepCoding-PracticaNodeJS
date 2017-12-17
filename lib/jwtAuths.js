'user strict'

const jwt = require('jsonwebtoken')

// expotar un creador de middlewares de autenticación

module.exports = () => {
  return function (req, res, next) {
    // leer credenciales
    const token = req.body.token || req.query.token || req.get('x-access-token')

    // comprobar credenciales
    if (!token) {
      const err1 = new Error('No token provided')
      err1.status = 401
      next(err1)
      return
    }
    // continuar llamando a next
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token error: ', err)
        const err2 = new Error('Invalid token')
        err2.status = 401
        next(err2)
        return
      }
      req.userId = decoded.user_id // lo guardamos en el request para los siguientes middlewares
      next()
    })
  }
}
