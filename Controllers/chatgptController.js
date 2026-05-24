const chatgpt = require("../Services/chatgpt");

const enviarPregunta = async (req, res) => {
  try {
    const { pregunta, historial, mantenerHistorial } = req.body;

    // Validacion
    if (!pregunta) {
      return res.status(400).json({ error: 'Falta el campo "pregunta"' });
    }

    // Si mantenerHistorial es false, no enviamos el historial
    const historialAUsar = mantenerHistorial ? (historial || []) : [];

    // Resultado
    const resultado = await chatgpt.enviarPregunta(pregunta, historialAUsar);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { enviarPregunta };