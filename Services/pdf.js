exports.analizarPDF = async (documentUrl) => {
  try {
    const endPoint = process.env.AZURE_F_ENDPOINT;
    const apiKey = process.env.AZURE_F_KEY;
    const modelId = 'prebuilt-invoice'

    const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

    if (!documentUrl.startsWith('http://') && !documentUrl.startsWith('https://')) {
      throw new Error('documentUrl debe ser una URL válida de un PDF accesible públicamente');
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urlSource: documentUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Problemas de acceso al servicio");
    }

    const operationLocation = response.headers.get("Operation-Location");

    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      });

      result = await checkResponse.json();

      if (result.status === "succeeded") break;
      if (result.status === "failed") {
        throw new Error(result.error?.message || "Análisis ha fallado");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      documentUrl: documentUrl,
      modelId: modelId,
      analyzeResult: result.analyzeResult,
      documents: result.analyzeResult?.documents || [],
      fields: result.analyzeResult?.documents?.[0]?.fields || {}
    };
  } catch (error) {
    throw error;
  }
};

exports.analizarPDFBuffer = async (fileBuffer) => {
  try {
    const endPoint = process.env.AZURE_F_ENDPOINT;
    const apiKey = process.env.AZURE_F_KEY;
    const modelId = 'prebuilt-invoice'

    const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

    // Enviar buffer directamente a Azure
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/pdf",
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Problemas de acceso al servicio");
    }

    const operationLocation = response.headers.get("Operation-Location");

    // Analizar documento con polling
    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      });

      result = await checkResponse.json();

      if (result.status === "succeeded") break;
      if (result.status === "failed") {
        throw new Error(result.error?.message || "Análisis ha fallado");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      documentUrl: "Archivo subido",
      modelId: modelId,
      analyzeResult: result.analyzeResult,
      documents: result.analyzeResult?.documents || [],
      fields: result.analyzeResult?.documents?.[0]?.fields || {}
    };
  } catch (error) {
    throw error;
  }
};