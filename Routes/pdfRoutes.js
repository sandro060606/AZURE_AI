const express = require('express')
const router = express.Router()

const pdfController = require('../Controllers/pdfController')

router.post('/analizar', pdfController.analizarPDF)

module.exports = router