exports.extraerDatos = async (texto) => {
  try {
    const URL = `${process.env.AZURE_F_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;
    //Paso 1 - Documento que se desea analizar
    const documentoProcesar = {
      kind: "EntityRecognition",
      analysisInput: {
        documents: [{ id: "1", language: "es", text: texto }],
      },
    };

    //Paso 2 - Enviar Documento
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": `${process.env.AZURE_F_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentoProcesar),
    });

    if (!response.ok) {
      const DataError = await response.json();
      throw new Error(DataError.error.message);
    }

    //Paso 3 - Recibir Respuesta
    const data = await response.json();

    if (data.errors > 0) {
      return [];
    }

    const primerDocumento = data.results.documents[0];

    // Mapeamos y retornamos las entidades encontradas
    return primerDocumento.entities.map((entidad) => {
      return {
        text: entidad.text,
        category: entidad.category,
        confidenceScore: (entidad.confidenceScore * 100).toFixed(0),
      };
    });
  } catch (error) {
    throw error;
  }
};