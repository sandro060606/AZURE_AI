exports.leerTextoImagen = async (imageUrl) => {
  try {
    const URL = `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/read/analyze`;

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    //Tratamiento Especial
    //AZURE no devuelve el texto inmediatamente, devuelve la URL en el Header
    const operationLocation = response.headers.get("operation-location");

    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY },
      });

      result = await checkResponse.json();

      if (result.status === "succeeded") break; //Escapar del While
      if (result.status === "failed")
        throw new Error("Error procesando imagen");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const lineasTexto = [];
    result.analyzeResult.readResults.forEach((page) => {
      page.lines.forEach((line) => {
        lineasTexto.push(line.text);
      });
    });

    return {
      imagenUrl: imageUrl,
      textoDetectado: lineasTexto,
      totalLineas: lineasTexto.length,
    };
  } catch (error) {
    throw error;
  }
};
