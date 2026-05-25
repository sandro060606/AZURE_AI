const chatboxButton = document.getElementById('chatboxButton')
const chatbox = document.getElementById('chatbox')
const closeChatbox = document.getElementById('closeChatbox')
const btnEnviar = document.getElementById('btnEnviar')
const mensajeInput = document.getElementById('mensajeInput')
const chatMessages = document.getElementById('chatMessages')
const mantenerHistorialCheckbox = document.getElementById('mantenerHistorial')

let historial = []

chatboxButton.addEventListener('click', () => { chatbox.classList.add('open') })
closeChatbox.addEventListener('click', () => { chatbox.classList.remove('open') })

btnEnviar.addEventListener('click', enviarMensaje)

async function enviarMensaje() {
    const mensaje = mensajeInput.value.trim()
    if (!mensaje) { return }

    agregarMensaje(mensaje, 'user')
    mensajeInput.value = ''

    try {
        const mantenerHistorial = mantenerHistorialCheckbox.checked

        const response = await fetch('/api/chatgpt/preguntar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pregunta: mensaje,
                historial: mantenerHistorial ? historial : [],
                mantenerHistorial: mantenerHistorial
            })
        })

        const data = await response.json()

        if (response.ok) {
            agregarMensaje(data.data.respuesta, 'assistant', data.data.tokens_usados)
            historial = mantenerHistorial ? data.data.nuevo_historial : []
        } else {
            agregarMensaje('Error al obtener respuesta', 'assistant')
        }
    } catch (err) {
        agregarMensaje('Error al enviar mensaje', 'assistant')
    }
}

function agregarMensaje(contenido, rol, tokens = null) {
    const mensajeDiv = document.createElement('div')
    mensajeDiv.className = `mensaje ${rol}`

    let html = `<p>${contenido.replace(/\n/g, '<br>')}</p>`
    if (tokens) {
        html += `<small style="display:block; margin-top:5px; opacity:0.6; font-style:italic;">Tokens: ${tokens}</small>`
    }

    mensajeDiv.innerHTML = html
    chatMessages.appendChild(mensajeDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
}