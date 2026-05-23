const preguntas = require("../Services/preguntas");

const responderPregunta = async (req, res) => {
  try {
    const { pregunta, contexto } = req.body;

    // Validacion
    if (!pregunta) {
      return res.status(400).json({ error: 'Falta el campo "pregunta"' });
    }

    if (!contexto) {
      return res.status(400).json({ error: 'Falta el campo "contexto"' });
    }

    // Resultado
    const resultado = await preguntas.responderPregunta(pregunta, contexto);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { responderPregunta };