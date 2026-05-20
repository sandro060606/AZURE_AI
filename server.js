require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const sentimientoRoutes = require('./routes/sentimientoRoutes')
const ocrRoutes = require('./routes/ocrRoutes')
const extraccionRoutes = require('./Routes/extraccionRoutes')

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

// Ruta API
app.use('/api/sentimiento', sentimientoRoutes)
app.use('/api/ocr', ocrRoutes)
app.use('/api/extraccion', extraccionRoutes)

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})
