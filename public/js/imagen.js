const imageUrlInput = document.getElementById('imageUrl')
const btnVistaPrevia = document.getElementById('btnVistaPrevia')
const btnAnalizar = document.getElementById('btnAnalizar')
const previewContainer = document.getElementById('previewContainer')
const imgPreview = document.getElementById('imgPreview')
const resultado = document.getElementById('resultado')
const descripcion = document.getElementById('descripcion')
const confianza = document.getElementById('confianza')
const etiquetas = document.getElementById('etiquetas')
const categorias = document.getElementById('categorias')
const colores = document.getElementById('colores')
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
        const response = await fetch('/api/imagen/analizar', {
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
    descripcion.textContent = `${data.descripcion}`
    confianza.textContent = `${data.confianza}%`
    
    etiquetas.innerHTML = ''
    if (data.etiquetas && data.etiquetas.length > 0) {
        data.etiquetas.forEach(etiqueta => {
            const span = document.createElement('span')
            span.className = 'etiqueta'
            span.textContent = etiqueta
            etiquetas.appendChild(span)
        })
    } else {
        etiquetas.innerHTML = '<p style="color: #666; font-style: italic;">No se detectaron etiquetas.</p>'
    }
    
    categorias.innerHTML = ''
    if (data.categorias && data.categorias.length > 0) {
        data.categorias.forEach(categoria => {
            const span = document.createElement('span')
            span.className = 'categoria'
            span.textContent = categoria.name || categoria
            categorias.appendChild(span)
        })
    } else {
        categorias.innerHTML = '<p style="color: #666; font-style: italic;">No se detectaron categorías.</p>'
    }
    
    colores.innerHTML = ''
    if (data.color && data.color.dominantColors && data.color.dominantColors.length > 0) {
        data.color.dominantColors.forEach(color => {
            const span = document.createElement('span')
            span.className = 'color'
            span.textContent = color
            colores.appendChild(span)
        })
    } else {
        colores.innerHTML = '<p style="color: #666; font-style: italic;">No se detectaron colores.</p>'
    }
    
    resultado.style.display = 'block'
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