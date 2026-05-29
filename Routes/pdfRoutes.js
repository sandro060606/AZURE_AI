const express = require('express')
const router = express.Router()

const pdfController = require('../Controllers/pdfController')

router.post('/analizar', pdfController.analizarPDF)
router.post('/analizar-file', pdfController.upload.single('pdfFile'), pdfController.analizarPDFFile)

module.exports = router