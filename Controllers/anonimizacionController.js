const anonimizacion = require("../Services/anonimizacion");

const anonimizarTexto = async (req, res) => {
  try {
    const { texto } = req.body;

    // Validacion
    if (!texto) {
      return res.status(400).json({ error: 'Falta el campo "texto"' });
    }

    // Resultado
    const resultado = await anonimizacion.anonimizarDatos(texto);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { anonimizarTexto };