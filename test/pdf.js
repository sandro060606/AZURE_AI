/* 
Analizar un archivo PDF, como si se tratara de un archivo PLANO (txt)
Este ejeercicio se puede realizar con PDF (online https:// ...) o PDF Local
*/

/* 
¿Como utilizar este servicio con un PDF Local?
***<input type='file>***
Cambiar:
  documentUrl = `miarchivo.pdf`
  Content-Type: apllication/octect-stream
*/

const endPoint = `https://azure-ai-1555585.services.ai.azure.com/`;
const apiKey = `Duj3b8VW8C4TOSTw00b0JpASilg60pwOQDfoO2XgNuYIxdQvv30HJQQJ99CEACYeBjFXJ3w3AAAAACOGJkdY`;
const modelId = `prebuilt-invoice`; //Optimizado para la lectura de boletas, facturas

const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;
const documentUrl = `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf`;

//AZURE NECESITA HOSTEAR EL ARCHIVO PDF
async function subirDocumento() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urlSource: documentUrl }),
    });

    if (!response.ok) {
      console.error("Problemas de Acceso");
      return;
    }

    const operationLocation = response.headers.get("Operation-Location");
    console.log("Analisis Iniciado, URL:", operationLocation);
    return operationLocation;
  } catch (error) {
    console.error(error);
  }
}

//Archivo que debemos de analizar
async function analizarDocumento(operationLocation) {
  try {
    const response = await fetch(operationLocation, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Problemas de Acceso");
      return;
    }

    //El analisis puede tardar unos instantes...
    const data = await response.json();

    if (data.status === "running" || data.status === "notStarted") {
      console.log("Procesando, espere por favor...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return analizarDocumento(operationLocation); //RECURSIVIVIDAD (MetodoA -> MetodoA)
    } else if (data.status === "succeeded") {
      console.log("Datos extraídos del PDF"); //¡Ya Funciona!
      /* console.log(data.analyzeResult.documents); //Info Completa */
      return data.analyzeResult;
    } else {
      console.error("Análisis ha fallado", data.error);
    }
  } catch (error) {
    console.error(error);
  }
}

//TEST - PRUEBA
async function procesarFactura() {
  const urlResultado = await subirDocumento();

  //si le objeto != undefined
  const resultadoFinal = await analizarDocumento(urlResultado);
  /* console.log("Procesando Factura") */
  console.log(resultadoFinal.documents[0].fields);
}

procesarFactura();
