/* 
Utiliza el LLM Phi-4 de Microsoft
Requiere la activacion de Microsoft.web (Subscripción > Configuracion > Proovedores de Recursos)
*/

const { response, json } = require("express")

//Datos de Acceso

const endpointURL = `https://azure-ai-1555585.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview`
const token = `Duj3b8VW8C4TOSTw00b0JpASilg60pwOQDfoO2XgNuYIxdQvv30HJQQJ99CEACYeBjFXJ3w3AAAAACOGJkdY`

/* //Configuracion del LLM
const data = {
    model: 'Phi-4',
    messages: [
        { role: 'user', content: '¿Que es la memoria RAM? necesito respuesta corta' }
    ]
} */

/* //Consulta
fetch(endpointURL, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `application/json`
    },
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(data => {
        console.log(`Respuesta Completa: ${data}`)
        if (data.choices && data.choices.length > 0) {
            console.log(`Respuesta Corta:${data.choices[0].message.content}`)
        } else {
            console.log(`No se encontró contenido para la respuesta`)
        }
    })
    .catch(e => { console.error(e) }) */

async function enviarPregunta(pregunta = ``) {
    pregunta += `, dame una respuesta corta`

    //Configuracion del LLM
    const configuracion = {
        model: 'Phi-4',
        messages: [
            { role: 'user', content: pregunta }
        ]
    }

    const response = await fetch(endpointURL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `application/json`
        },
        body: JSON.stringify(configuracion)
    })

    if (!response.ok) {
        console.error(`No se pudo acceder al servicio`)
    }

    const data = await response.json()
    console.log(`Respuesta Completa: ${data}`)
    console.log(`Respuesta Completa: ${data}`)
    if (data.choices && data.choices.length > 0) {
        console.log(`Respuesta Corta:${data.choices[0].message.content}`)
    } else {
        console.log(`No se encontró contenido para la respuesta`)
    }

}

//Test
enviarPregunta('Dime un Resumen del Barca Breve') 