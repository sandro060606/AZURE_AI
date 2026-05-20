const imageUrlInput = document.getElementById('imageUrl')
const btnVistaPrevia = document.getElementById('btnVistaPrevia')
const btnAnalizar = document.getElementById('btnAnalizar')
const previewContainer = document.getElementById('previewContainer')
const imgPreview = document.getElementById('imgPreview')
const resultado = document.getElementById('resultado')
const textoDetectado = document.getElementById('textoDetectado')
const totalLineas = document.getElementById('totalLineas')
const loading = document.getElementById('loading')
const errorDiv = document.getElementById('error')
const errorMensaje = document.getElementById('errorMensaje')

// Evento para ver la imagen antes de analizar
btnVistaPrevia.addEventListener('click', () => {
    const url = imageUrlInput.value.trim()
    
    if (!url) {
        mostrarError('Por favor, ingresa una URL de imagen válida')
        return
    }

    imgPreview.src = url
    previewContainer.style.display = 'block'
    
    // Manejar error de carga de imagen
    imgPreview.onerror = () => {
        previewContainer.style.display = 'none'
        mostrarError('No se pudo cargar la imagen. Verifica la URL.')
    }
})

// Evento para analizar la imagen
btnAnalizar.addEventListener('click', async () => {
    const imageUrl = imageUrlInput.value.trim()

    if (!imageUrl) {
        mostrarError('Por favor, ingresa una URL de imagen')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/ocr/leer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al procesar la imagen')
        }

        mostrarResultado(data.data)

    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

function mostrarResultado(data) {
    // Limpiar texto anterior
    textoDetectado.innerHTML = ''
    
    // Si no hay texto detectado
    if (data.textoDetectado.length === 0) {
        textoDetectado.innerHTML = '<p style="color: #666; font-style: italic;">No se detectó texto en la imagen.</p>'
    } else {
        // Insertar cada línea de texto
        data.textoDetectado.forEach(linea => {
            const p = document.createElement('p')
            p.textContent = linea
            textoDetectado.appendChild(p)
        })
    }

    totalLineas.textContent = data.totalLineas
    resultado.style.display = 'block'
    
    // Hacer scroll hacia el resultado
    resultado.scrollIntoView({ behavior: 'smooth' })
}

function mostrarError(mensaje) {
    ocultarTodo()
    errorMensaje.textContent = mensaje
    errorDiv.style.display = 'block'
}

function ocultarTodo() {
    resultado.style.display = 'none'
    errorDiv.style.display = 'none'
    loading.style.display = 'none'
}