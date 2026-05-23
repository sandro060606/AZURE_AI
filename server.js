require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const sentimientoRoutes = require('./Routes/sentimientoRoutes')
const ocrRoutes = require('./Routes/ocrRoutes')
const extraccionRoutes = require('./Routes/extraccionRoutes')
const imagenRoutes = require('./Routes/imagenRoutes')
const resumenRoutes = require('./Routes/resumenRoutes')
const anonimizacionRoutes = require('./Routes/anonimizacionRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Ruta Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/index.html'))
})

app.get('/sentimientos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/sentimiento.html'))
})
app.get('/ocr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/ocr.html'))
})
app.get('/extraccion', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/extraccion.html'))
})
app.get('/imagen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/imagen.html'))
})
app.get('/resumen', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/resumen.html'))
})

// Ruta API
app.use('/api/sentimiento', sentimientoRoutes)
app.use('/api/ocr', ocrRoutes)
app.use('/api/extraccion', extraccionRoutes)
app.use('/api/imagen', imagenRoutes)
app.use('/api/resumen', resumenRoutes)
app.use('/api/anonimizacion', anonimizacionRoutes)

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})