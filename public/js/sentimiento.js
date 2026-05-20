const btnAnalizar = document.getElementById('btnAnalizar')
const textoInput = document.getElementById('texto')
const resultado = document.getElementById('resultado')
const loading = document.getElementById('loading')
const error = document.getElementById('error')

btnAnalizar.addEventListener('click', async () => {
    const texto = textoInput.value.trim()

    // Validación
    if (!texto) {
        mostrarError('Por favor, escribe un texto para analizar')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/sentimiento/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al analizar')
        }

        mostrarResultado(data.data)

    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

function mostrarResultado(data) {
    // Mostrar sentimiento
    const sentimientoElement = document.getElementById('sentimiento')
    sentimientoElement.textContent = traducirSentimiento(data.sentimiento)
    sentimientoElement.className = `sentimiento ${data.sentimiento}`

    // Mostrar confianza
    document.getElementById('positivo').textContent = `${data.confianza.positivo}%`
    document.getElementById('negativo').textContent = `${data.confianza.negativo}%`
    document.getElementById('neutral').textContent = `${data.confianza.neutral}%`

    // Mostrar texto original
    document.getElementById('textoOriginal').textContent = data.textoOriginal

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

function traducirSentimiento(sentimiento) {
    const traducciones = {
        'positive': 'POSITIVO',
        'negative': 'NEGATIVO',
        'neutral': 'NEUTRAL'
    }
    return traducciones[sentimiento] || sentimiento
}