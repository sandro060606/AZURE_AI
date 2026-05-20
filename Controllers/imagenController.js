const imagenService = require("../Services/imagen");

const analizarImagen = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Falta el campo "imageUrl"' });
    }

    const resultado = await imagenService.analizarImagen(imageUrl);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analizarImagen };