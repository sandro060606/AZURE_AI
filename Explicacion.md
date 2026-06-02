# Guía rápida: Vistas de PDF y Chatbox

Este README explica paso a paso cómo funcionan la vista de análisis de PDF y el chatbox en este proyecto, con referencias directas a los archivos clave. Está pensado para leer "a medida": cada sección describe la parte frontend, el controlador y el servicio que la procesa.

---

## Resumen general
- Flujo común: Frontend → Ruta `/api/...` → `Controllers` → `Services` → Azure → respuesta al frontend.
- Archivos principales (enlazados):
  - PDF: [Controllers/pdfController.js](Controllers/pdfController.js), [Services/pdf.js](Services/pdf.js), [public/html/pdf.html](public/html/pdf.html), [public/js/pdf.js](public/js/pdf.js)
  - Chat: [public/js/chatbox.js](public/js/chatbox.js), [Controllers/chatgptController.js](Controllers/chatgptController.js), [Services/chatgpt.js](Services/chatgpt.js)

---

## Vista de PDF — explicación por partes

1) Frontend
- Archivo: [public/html/pdf.html](public/html/pdf.html)
  - Muestra opciones: `Archivo local` o `URL`.
  - Paneles para resultados, carga y errores.
- Script: [public/js/pdf.js](public/js/pdf.js)
  - Detecta si el usuario elige `file` o `url`.
  - Si `file`: crea `FormData` con el `pdfFile` y POST a `/api/pdf/analizar-file`.
  - Si `url`: POST JSON a `/api/pdf/analizar` con `{ documentUrl }`.
  - Funciones UI: `showLoading()`, `showError()`, `displayResults(data)` que mapea `data.fields` a los elementos del DOM (ID de factura, fecha, items, direcciones, totales).

2) Controlador
- Archivo: [Controllers/pdfController.js](Controllers/pdfController.js)
  - `analizarPDF(req,res)`: espera `documentUrl` en `req.body` y llama a `pdf.analizarPDF(documentUrl)`.
  - `analizarPDFFile(req,res)`: usa `req.file.buffer` (multer con `memoryStorage`) y llama a `pdf.analizarPDFBuffer(fileBuffer)`.
  - Responde `{ success: true, data: resultado }` o errores HTTP adecuados.

3) Servicio (integración con Azure)
- Archivo: [Services/pdf.js](Services/pdf.js)
  - Variables de entorno necesarias: `AZURE_F_ENDPOINT` y `AZURE_F_KEY`.
  - Usa `modelId = 'prebuilt-invoice'` y la API de Form Recognizer:
    `POST ${AZURE_F_ENDPOINT}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`
  - Si la entrada es URL envía JSON `{ urlSource: documentUrl }` con `Content-Type: application/json`.
  - Si es buffer envía `Content-Type: application/pdf` con el contenido binario.
  - Tras la petición inicial lee `Operation-Location` (header) y hace polling (GET cada 2s) hasta `status === "succeeded"` o `failed`.
  - Devuelve un objeto con `analyzeResult`, `documents` y `fields` (los campos esperados por el frontend: `InvoiceId`, `Items`, `CustomerAddress`, etc.).

4) Recomendaciones y notas
- `memoryStorage()` carga todo en RAM: para PDFs muy grandes usar almacenamiento temporal en disco.
- Asegurar valores de entorno y acceso de red desde el servidor al endpoint de Azure.
- El modelo actual es `prebuilt-invoice` — si el documento no es una factura, los campos pueden faltar.

---

## Chatbox — explicación por partes

1) Frontend
- Archivo: [public/js/chatbox.js](public/js/chatbox.js)
  - Controles: abrir/cerrar chat, input de texto, botón enviar, checkbox `mantenerHistorial`.
  - `enviarMensaje()` añade el mensaje del usuario en pantalla y hace POST a `/api/chatgpt/preguntar` con `{ pregunta, historial, mantenerHistorial }`.
  - Si `mantenerHistorial` es true el frontend envía el arreglo `historial` guardado localmente; si no, envía `[]`.
  - `agregarMensaje()` inserta mensajes en el DOM y desplaza el scroll.

2) Controlador
- Archivo: [Controllers/chatgptController.js](Controllers/chatgptController.js)
  - `enviarPregunta(req,res)` valida `pregunta` y decide `historialUsar = mantenerHistorial ? historial : []`.
  - Llama a `chatgpt.enviarPregunta(pregunta, historialUsar)` y retorna `{ success: true, data: resultado }`.

3) Servicio (OpenAI / Azure OpenAI)
- Archivo: [Services/chatgpt.js](Services/chatgpt.js)
  - Variables de entorno: `AZURE_CHATGPT_ENDPOINT`, `AZURE_CHATGPT_DEPLOYMENT`, `API_VERSION_CHATGPT`, `API_KEY_CHATGPT`.
  - Construye request a la ruta de chat completions del deployment: `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`.
  - Mensajes enviados:
    - `{ role: 'system', content: 'Eres un asistente útil' }` (siempre primero).
    - `...historial` (si se pasó desde frontend).
    - `{ role: 'user', content: pregunta }` (se añade `, Dame una respuesta corta` en el código actual).
  - Parámetros: `max_completion_tokens: 500`, `temperature: 0.7`.
  - Respuesta retornada al controlador: `{ respuesta, tokens_usados, nuevo_historial }` donde `nuevo_historial` es el historial actualizado con los dos últimos mensajes (user y assistant).

4) Recomendaciones y notas
- Actualmente el frontend guarda el historial en memoria del navegador; si quieres conservar conversaciones entre sesiones, persiste `nuevo_historial` en backend o en `localStorage`.
- `max_completion_tokens` y la instrucción añadida (`Dame una respuesta corta`) limitan la longitud de la respuesta: ajústalas según necesidad.

---

## Variables de entorno (mínimas)
- Para PDF (Form Recognizer): `AZURE_F_ENDPOINT`, `AZURE_F_KEY`.
- Para Chat: `AZURE_CHATGPT_ENDPOINT`, `AZURE_CHATGPT_DEPLOYMENT`, `API_VERSION_CHATGPT`, `API_KEY_CHATGPT`.

---

## Cómo probar localmente (rápido)
1. Instala dependencias si no están:

```powershell
npm install
```

2. Exporta las variables de entorno (Windows PowerShell ejemplo):

```powershell
$env:AZURE_F_ENDPOINT = 'https://<tu-endpoint>'
$env:AZURE_F_KEY = '<tu-key>'
$env:AZURE_CHATGPT_ENDPOINT = 'https://<tu-endpoint>'
$env:AZURE_CHATGPT_DEPLOYMENT = '<deployment-name>'
$env:API_VERSION_CHATGPT = '2023-10-01-preview'
$env:API_KEY_CHATGPT = '<tu-key>'
node server.js
```

3. Abrir en el navegador:
- Vista PDF: `http://localhost:3000/html/pdf.html` (ajusta puerto según `server.js`).
- Probar chatbox desde la interfaz donde esté incluido (p. ej. la página principal o un componente que cargue `chatbox.js`).

4. Probar endpoints con `curl` (ejemplo JSON para URL):

```powershell
curl -X POST http://localhost:3000/api/pdf/analizar -H "Content-Type: application/json" -d '{"documentUrl":"https://ejemplo.com/factura.pdf"}'
```

---

## Siguientes pasos sugeridos
- Añadir persistencia del historial (base de datos o `localStorage`).
- Mejorar UX: deshabilitar botón enviar durante petición y mostrar indicador "escribiendo...".
- Manejo de timeouts en el polling de `pdf.js` para evitar loops infinitos.

---

Si quieres, voy explicando cada archivo línea a línea —dime por cuál quieres empezar y lo hago "a medida".