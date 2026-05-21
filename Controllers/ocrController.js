const ocr = require("../Services/ocr");

const leerImagen = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Falta el campo "imageUrl"' });
    }

    const resultado = await ocr.leerTextoImagen(imageUrl);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { leerImagen };