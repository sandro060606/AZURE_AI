const express = require('express')
// Enrutador
const router = express.Router()

const chatgptController = require('../Controllers/chatgptController')

router.post('/preguntar', chatgptController.enviarPregunta)

module.exports = router