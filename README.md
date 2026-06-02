# Servicios de Azure AI

Aplicación web que integra múltiples servicios de **Azure AI** (Language y Computer Vision) para realizar diferentes tipos de analisis (Texto, Imagenes, etc)

---

## Funcionalidades

| Módulo                       | Descripción                                                                                  | API de Azure             |
| ---------------------------- | -------------------------------------------------------------------------------------------- | ------------------------ |
| **Análisis de Sentimientos** | Analiza el sentimiento de un texto (positivo, negativo, neutral) con puntuación de confianza | Azure Language Service   |
| **OCR**                      | Extrae texto de imágenes mediante reconocimiento óptico de caracteres                        | Azure Computer Vision    |
| **Extracción de Entidades**  | Identifica y clasifica entidades (personas, lugares, organizaciones, etc.) en un texto       | Azure Language Service   |
| **Análisis de Imágenes**     | Describe imágenes, detecta categorías, etiquetas y colores dominantes                        | Azure Computer Vision    |
| **Resumen de Textos**        | Extrae las ideas y frases más importantes de documentos extensos de forma automática         | Azure AI Language        |
| **Anonimización de Datos**   | Oculta datos sensibles como nombres, DNI, teléfonos y correos electrónicos                   | Azure PII Detection      |
| **Responder Preguntas**      | Obtén respuestas a partir de un contexto proporcionado                                       | Azure Question Answering |
| **Chat con IA**              | Asistente conversacional interactivo con historial de conversación                           | Azure OpenAI             |
| **Análisis de PDF**          | Extrae información de facturas y documentos PDF usando Azure Form Recognizer                 | Azure Form Recognizer    |

---

## Estructura del Proyecto

```
AZURE_AI/
├── Controllers/              # Controladores (lógica de las rutas API)
│   ├── sentimientoController.js
│   ├── ocrController.js
│   ├── extraccionController.js
│   ├── imagenController.js
│   ├── resumenController.js
│   ├── anonimizacionController.js
│   ├── preguntasController.js
│   ├── chatgptController.js
│   └── pdfController.js
├── Routes/                   # Definición de rutas Express
│   ├── sentimientoRoutes.js
│   ├── ocrRoutes.js
│   ├── extraccionRoutes.js
│   ├── imagenRoutes.js
│   ├── resumenRoutes.js
│   ├── anonimizacionRoutes.js
│   ├── preguntasRoutes.js
│   ├── chatgptRoutes.js
│   └── pdfRoutes.js
├── Services/                 # Servicios que consumen las APIs de Azure
│   ├── sentimiento.js
│   ├── ocr.js
│   ├── extraccion.js
│   ├── imagen.js
│   ├── resumen.js
│   ├── anonimizacion.js
│   ├── preguntas.js
│   ├── chatgpt.js
│   └── pdf.js
├── public/                   # Archivos estáticos del frontend
│   ├── css/
│   │   ├── index.css
│   │   ├── sentimiento.css
│   │   ├── ocr.css
│   │   ├── extraccion.css
│   │   ├── imagen.css
│   │   ├── resumen.css
│   │   ├── anonimizacion.css
│   │   ├── preguntas.css
│   │   └── pdf.css
│   ├── html/
│   │   ├── index.html
│   │   ├── sentimiento.html
│   │   ├── ocr.html
│   │   ├── extraccion.html
│   │   ├── imagen.html
│   │   ├── resumen.html
│   │   ├── anonimizacion.html
│   │   ├── preguntas.html
│   │   └── pdf.html
│   └── js/
│       ├── chatbox.js
│       ├── sentimiento.js
│       ├── ocr.js
│       ├── extraccion.js
│       ├── imagen.js
│       ├── resumen.js
│       ├── anonimizacion.js
│       ├── preguntas.js
│       └── pdf.js
├── server.js                 # Punto de entrada del servidor
├── .env                      # Variables de entorno (no incluido en git)
├── package.json
└── README.md
```

---

## Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/)
- Una cuenta de [Microsoft Azure](https://portal.azure.com/) con los siguientes servicios activos:
  - **Azure Language Service**
  - **Azure Computer Vision**
  - **Azure OpenAI** (para el chat)
  - **Azure Form Recognizer** (para análisis de PDF)

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/sandro060606/AZURE_AI.git
   cd AZURE_AI
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

   Las dependencias incluyen:
   - `express` - Framework web
   - `cors` - Middleware para CORS
   - `dotenv` - Gestión de variables de entorno
   - `multer` - Manejo de subida de archivos (para PDF)

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   # Azure Language Service (Sentimientos, Extracción, Resumen, Anonimización, Preguntas, Análisis de PDF)
   AZURE_F_KEY=tu_clave_de_azure_language
   AZURE_F_ENDPOINT=https://tu-recurso.services.ai.azure.com

   # Azure Computer Vision (OCR e Imágenes)
   AZURE_CV_KEY=tu_clave_de_computer_vision
   AZURE_CV_ENDPOINT=https://tu-recurso.cognitiveservices.azure.com/

   # Azure OpenAI (Chat con IA)
   API_KEY_CHATGPT=tu_clave_de_openai
   AZURE_CHATGPT_ENDPOINT=https://tu-recurso.openai.azure.com/
   AZURE_CHATGPT_DEPLOYMENT=gpt-5.4-mini
   API_VERSION_CHATGPT=2025-04-01-preview

   # Configuración Servidor
   PORT=3000
   ```

4. **Iniciar el servidor**

   ```bash
   node server.js
   ```

5. Abrir el navegador en `http://localhost:3000`

---

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express
- **APIs de Azure:**
  - Azure Language Service (Sentimientos, Extracción, Resumen, Anonimización, Preguntas)
  - Azure Computer Vision (OCR, Análisis de Imágenes)
  - Azure OpenAI (Chat con IA)
  - Azure Form Recognizer (Análisis de PDF)
- **Frontend:** HTML, CSS, JavaScript vanilla
- **Dependencias:** express, cors, dotenv, multer
