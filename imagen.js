//Deteccion de imagenes
const suscriptionKey = "3Ywfn0rbUSJrqhnDkr1eYr6Lv56QZc9wxpQBUZEJVOu93MHq5jmeJQQJ99CEACYeBjFXJ3w3AAAFACOGDoAS";
const endpoint = "https://CV1555585.cognitiveservices.azure.com/";

//URL describe las funcionalidades que deseamos aprovechar
const url = `${endpoint}vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

// Imagen a analizar
const imageUrl = "https://images.pexels.com/videos/7655554/pexels-photo-7655554.jpeg";

//Esta funcionalidad requiere ejecutarse como promesa
async function analizarImagen() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl })
    });

    // Manejo de errores
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    // Resultado Favorable
    const data = await response.json();

    console.log("Descripcion de la Imagen:", data.description.captions[0].text);
    console.log("Confianza", data.description.captions[0].confidence);
    console.log("Etiquetas:" + data.description.tags.join(", "));
    // console.log(data.description);
  } catch (error) {
    console.error(`Error al analizar la imagen:", ${error.message}`);
  }
}

analizarImagen();