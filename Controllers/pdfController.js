const pdf = require("../Services/pdf");

const analizarPDF = async (req, res) => {
  try {
    const { documentUrl } = req.body;

    if (!documentUrl) {
      return res.status(400).json({ error: 'Falta el campo "documentUrl"' });
    }

    const resultado = await pdf.analizarPDF(documentUrl);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analizarPDF };
