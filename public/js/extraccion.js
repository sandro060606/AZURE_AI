// Variable global para almacenar los datos (Entidades) recibidos de Azure
let entidades = [];

const btnAnalizar = document.getElementById('btnAnalizar');
const textoInput = document.getElementById('texto');
const resultadosTabla = document.getElementById('resultadosTabla');
const checkboxes = document.querySelectorAll('.filtro-categoria');
const resultado = document.getElementById('resultado');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// Escuchar cambios en los checkboxes para filtrar dinámicamente en el frontend
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderizar);
});

// Evento click de analizar
btnAnalizar.addEventListener('click', async () => {
    const textoValue = textoInput.value.trim();

    if (!textoValue) {
        mostrarError('Por favor, ingresa un texto para analizar.');
        return;
    }

    ocultarTodo();
    loading.style.display = 'block';

    try {
        btnAnalizar.disabled = true;
        btnAnalizar.innerText = 'Analizando...';

        const response = await fetch('/api/extraccion/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoValue })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            entidades = result.data;
            resultado.style.display = 'block';
            renderizar();
        } else {
            mostrarError(result.error || 'Error en la extracción de datos.');
        }

    } catch (err) {
        console.error(err);
        mostrarError('Error al conectar con el servidor.');
    } finally {
        btnAnalizar.disabled = false;
        btnAnalizar.innerText = 'Analizar Texto';
        loading.style.display = 'none';
    }
});

function mostrarError(mensaje) {
    document.getElementById('errorMensaje').textContent = mensaje;
    error.style.display = 'block';
}

function ocultarTodo() {
    resultado.style.display = 'none';
    error.style.display = 'none';
    if (loading) loading.style.display = 'none';
}

// Función para renderizar los resultados con filtro en el frontend
function renderizar() {
    // Obtener las categorías que están seleccionadas (checked)
    const categoriasSeleccionadas = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Si no hay datos analizados todavía
    if (entidades.length === 0) {
        resultadosTabla.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">No hay datos para mostrar</td>
            </tr>
        `;
        return;
    }

    // Filtrar entidades según las categorías seleccionadas
    const entidadesFiltradas = entidades.filter(entidad => {
        if (categoriasSeleccionadas.length === 0) {
            return true;
        }
        return categoriasSeleccionadas.includes(entidad.category);
    });

    // Filtrar no hay Nada
    if (entidadesFiltradas.length === 0) {
        resultadosTabla.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">Ninguna entidad coincide con los filtros seleccionados</td>
            </tr>
        `;
        return;
    }

    // Dibujar las filas en la tabla
    resultadosTabla.innerHTML = entidadesFiltradas.map(entidad => {
        // Formatear porcentaje confidenceScore a número y poner badge con colores según confianza
        const score = parseFloat(entidad.confidenceScore) || 0;
        let badgeClass = 'badge-low';
        if (score >= 80) {
            badgeClass = 'badge-high';
        } else if (score >= 50) {
            badgeClass = 'badge-medium';
        }

        // Traducir o formatear categorías para que se vean más bonitas
        const catMap = {
            'Person': 'Persona',
            'Location': 'Ubicación',
            'Organization': 'Organización',
            'Quantity': 'Cantidad',
            'DateTime': 'Fecha/Hora',
            'URL': 'Enlace URL',
            'Email': 'Correo',
            'personType': 'Cargo/Rol',
            'Event': 'Evento',
            'Product': 'Producto',
            'Skill': 'Habilidad',
            'Address': 'Dirección',
            'phoneNumber': 'Teléfono',
            'ipAddress': 'IP'
        };
        const prettyCategory = catMap[entidad.category] || entidad.category;

        return `
            <tr>
                <td class="text-entity"><strong>${entidad.text}</strong></td>
                <td class="category-entity"><span class="cat-tag">${prettyCategory}</span></td>
                <td class="score-entity"><span class="score-badge ${badgeClass}">${score}%</span></td>
            </tr>
        `;
    }).join('');
}