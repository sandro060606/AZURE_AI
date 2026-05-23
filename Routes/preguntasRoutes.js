const express = require('express')
// Enrutador
const router = express.Router()

const preguntasController = require('../Controllers/preguntasController')

router.post('/responder', preguntasController.responderPregunta)

module.exports = router