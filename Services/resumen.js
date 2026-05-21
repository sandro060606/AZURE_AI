exports.resumirTexto = async (texto, numOraciones = 2) => {
    try {
        const URL = `${process.env.AZURE_L_ENDPOINT}/language/analyze-text/jobs?api-version=2023-04-01`;

        const cuerpoPeticion = {
            displayName: "Resumen de Texto",
            analysisInput: {
                documents: [
                    {
                        id: "1",
                        language: "es",
                        text: texto,
                    },
                ],
            },
            tasks: [
                {
                    kind: "ExtractiveSummarization",
                    taskName: "resumen_extractivo",
                    parameters: { sentenceCount: numOraciones },
                },
            ],
        };

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_L_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cuerpoPeticion),
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.error.message);
        }

        const URLSEGUIMIENTO = response.headers.get("operation-location");

        // Bucle de seguimiento
        let resultadoFinal = null;
        while (true) {
            const respuestaSeguimiento = await fetch(URLSEGUIMIENTO, {
                headers: { "Ocp-Apim-Subscription-Key": process.env.AZURE_L_KEY },
            });

            resultadoFinal = await respuestaSeguimiento.json();

            if (resultadoFinal.status === "succeeded") { break; }
            if (resultadoFinal.status === "failed") { throw new Error("El servidor no pudo completar el proceso"); }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Extraer resumen
        const tareaFinalizada = resultadoFinal.tasks.items[0];
        const frasesResumen = tareaFinalizada.results.documents[0].sentences;

        return {
            textoOriginal: texto,
            resumen: frasesResumen.map((frase) => frase.text),
        };
    } catch (error) {
        throw error;
    }
};