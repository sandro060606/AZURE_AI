// Variable global para almacenar los datos (Entidades) recibidas de Azure
let entidades = [];

const btnAnalizar = document.getElementById('btnAnalizar');
const textoInput = document.getElementById('texto');
const resultadosTabla = document.getElementById('resultadosTabla');
const checkboxes = document.querySelectorAll('.filtro-categoria');

// Escuchar cambios en los checkboxes para filtrar dinámicamente en el frontend
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderizar);
});

// Evento click de analizar
btnAnalizar.addEventListener('click', async () => {
    const textoValue = textoInput.value.trim();

    if (!textoValue) {
        alert('Por favor ingresa un texto.');
        return;
    }

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

        if (result.success) {
            entidades = result.data;
            renderizar();
        } else {
            alert('Error en la extracción: ' + result.error);
        }

    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor.');
    } finally {
        btnAnalizar.disabled = false;
        btnAnalizar.innerText = 'Analizar';
    }
});

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
                <td colspan="3" style="text-align: center;">No hay datos para mostrar</td>
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
                <td colspan="3" style="text-align: center;">Ninguna entidad coincide con los filtros</td>
            </tr>
        `;
        return;
    }

    // Dibujar las filas en la tabla
    resultadosTabla.innerHTML = entidadesFiltradas.map(entidad => {;
        return `
            <tr>
                <td>${entidad.text}</td>
                <td>${entidad.category}</td>
                <td>${entidad.confidenceScore}%</td>
            </tr>
        `;
    }).join('');
}