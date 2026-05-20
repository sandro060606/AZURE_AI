const express = require('express')
const router = express.Router()

const ocrController = require('../controllers/ocrController')

router.post('/leer', ocrController.leerImagen)

module.exports = router