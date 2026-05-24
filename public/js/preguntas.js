const btnResponder = document.getElementById('btnResponder')
const preguntaInput = document.getElementById('pregunta')
const contextoInput = document.getElementById('contexto')
const resultado = document.getElementById('resultado')
const loading = document.getElementById('loading')
const error = document.getElementById('error')

btnResponder.addEventListener('click', async () => {
    const pregunta = preguntaInput.value.trim()
    const contexto = contextoInput.value.trim()

    // Validación
    if (!pregunta) {
        mostrarError('Por favor, escribe una pregunta')
        return
    }
    if (!contexto) {
        mostrarError('Por favor, proporciona el contexto del documento')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/preguntas/responder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pregunta, contexto })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener respuesta')
        }

        mostrarResultado(data.data)

    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

function mostrarResultado(data) {
    document.getElementById('respuesta').textContent = data.respuesta
    document.getElementById('confianza').textContent = data.confianza

    resultado.style.display = 'block'
}

function mostrarError(mensaje) {
    document.getElementById('errorMensaje').textContent = mensaje
    error.style.display = 'block'
}

function ocultarTodo() {
    resultado.style.display = 'none'
    error.style.display = 'none'
    if (loading) loading.style.display = 'none'
}