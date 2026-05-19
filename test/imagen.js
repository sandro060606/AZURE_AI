//Deteccion de imagenes
const suscriptionKey =
  "3Ywfn0rbUSJrqhnDkr1eYr6Lv56QZc9wxpQBUZEJVOu93MHq5jmeJQQJ99CEACYeBjFXJ3w3AAAFACOGDoAS";
const endpoint = "https://cv1555585.cognitiveservices.azure.com";

//URL describe las funcionalidades que deseamos aprovechar
const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

// Imagen a analizar
const imageUrl =
  "https://get.pxhere.com/photo/hand-man-person-suit-people-white-male-guy-hollywood-standing-portrait-young-finger-food-corporate-tie-human-gesture-professional-business-banana-arm-formal-help-eyes-danger-gun-funny-expression-angry-boss-body-handsome-intense-leader-attractive-adult-businessman-executive-success-smart-cartoon-silly-grin-tough-confident-gesturing-successful-business-man-movie-star-spoof-businessperson-894428.jpg";

//Esta funcionalidad requiere ejecutarse como promesa
async function analizarImagen() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    // Manejo de errores
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    // Resultado Favorable
    const data = await response.json();
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2);

    console.log("Descripcion de la Imagen:", data.description.captions[0].text);
    console.log("Confianza", `${confianza} %`);
    console.log("Etiquetas:" + data.description.tags.join(", "));
    // console.log(data.description);
  } catch (error) {
    console.error(`Error al analizar la imagen:", ${error.message}`);
  }
}

analizarImagen();
