const extraccion = require('../Services/extraccion')

const analizarTexto = async (req, res) => {
    try {
        const {texto} = req.body

        //Validacion
        if(!texto){
            return res.status(400).json({error: 'Falta Texto'})
        }

        const response = await extraccion.extraerDatos(texto)
        res.json({success: true, data: response})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = { analizarTexto }