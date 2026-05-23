exports.responderPregunta = async (pregunta, contexto) => {
  try {
    const URL = `${process.env.AZURE_F_ENDPOINT}/language/:query-text?api-version=2021-10-01`;

    const cuerpoPeticion = {
      question: pregunta,
      records: [
        {
          id: "doc_01",
          text: contexto,
        },
      ],
    };

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_F_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpoPeticion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();

    const respuesta = data.answers[0].answer;
    const confianza = (data.answers[0].confidenceScore * 100).toFixed(2);

    return {
      pregunta: pregunta,
      respuesta: respuesta,
      confianza: `${confianza}%`,
      contexto: contexto,
    };
  } catch (error) {
    throw error;
  }
};
