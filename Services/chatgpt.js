exports.enviarPregunta = async (pregunta, historial = []) => {
  try {
    const AZURE_ENDPOINT = process.env.AZURE_CHATGPT_ENDPOINT;
    const DEPLOYMENT_NAME = process.env.AZURE_CHATGPT_DEPLOYMENT;
    const API_VERSION = process.env.API_VERSION_CHATGPT;

    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

    pregunta += ", Dame una respuesta corta";

    const body = {
      messages: [
        { role: "system", content: "Eres un asistente útil" },
        ...historial,
        { role: "user", content: pregunta },
      ],
      max_completion_tokens: 500,
      temperature: 0.7
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.API_KEY_CHATGPT
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error al acceder al servicio");
    }

    const data = await response.json();
    const mensaje = data.choices[0].message;

    return {
      respuesta: mensaje.content,
      tokens_usados: data.usage.total_tokens,
      nuevo_historial: [...historial, { role: 'user', content: pregunta }, mensaje]
    };
  } catch (error) {
    throw error;
  }
};