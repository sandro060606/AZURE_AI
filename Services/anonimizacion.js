exports.anonimizarDatos = async (texto) => {
  try {
    const URL = `${process.env.AZURE_F_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;

    const documentoAnonimizar = {
      kind: "PiiEntityRecognition",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
      parameters: {
        redactionPolicy: {
          policyKind: "CharacterMask",
          redactionCharacter: "*",
        },
      },
    };

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_F_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentoAnonimizar),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();

    if (data.results.errors.length > 0) {
      throw new Error(JSON.stringify(data.results.errors));
    }

    const primerDocumento = data.results.documents[0];

    return {
      textoOriginal: texto,
      textoAnonimizado: primerDocumento.redactedText,
      entidadesDetectadas: primerDocumento.entities,
    };
  } catch (error) {
    throw error;
  }
};
