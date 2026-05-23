const btnAnonimizar = document.getElementById('btnAnonimizar')
const textoInput = document.getElementById('texto')
const resultado = document.getElementById('resultado')
const loading = document.getElementById('loading')
const error = document.getElementById('error')

btnAnonimizar.addEventListener('click', async () => {
    const texto = textoInput.value.trim()

    // Validación
    if (!texto) {
        mostrarError('Por favor, escribe un texto para anonimizar')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/anonimizacion/anonimizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al anonimizar')
        }

        mostrarResultado(data.data)

    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

function mostrarResultado(data) {
    document.querySelector('#textoAnonimizado').textContent = data.textoAnonimizado
    const entidadesList = document.getElementById('entidadesList')
    entidadesList.innerHTML = ''

    if (data.entidadesDetectadas && data.entidadesDetectadas.length > 0) {
        data.entidadesDetectadas.forEach(entidad => {
            const entidadItem = document.createElement('div')
            entidadItem.className = 'entidad-item'
            entidadItem.innerHTML = `
                <span class="entidad-tipo">${entidad.category}</span>
                <span class="entidad-texto">${entidad.text}</span>
            `
            entidadesList.appendChild(entidadItem)
        })
    } else {
        entidadesList.innerHTML = '<p class="no-entidades">No se detectaron entidades sensibles</p>'
    }

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
