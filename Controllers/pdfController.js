const pdf = require("../Services/pdf");
const multer = require('multer');

// Usar memory storage para no guardar archivos en disco
const upload = multer({ storage: multer.memoryStorage() });

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

const analizarPDFFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const fileBuffer = req.file.buffer;
    const resultado = await pdf.analizarPDFBuffer(fileBuffer);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analizarPDF, analizarPDFFile, upload };
