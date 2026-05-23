const express = require('express')
// Enrutador
const router = express.Router()

const anonimizacionController = require('../Controllers/anonimizacionController')

router.post('/anonimizar', anonimizacionController.anonimizarTexto)

module.exports = router
