document.addEventListener('DOMContentLoaded', () => {
    const textoTextArea = document.getElementById('texto');
    const nroFrasesInput = document.getElementById('nroFrases');
    const btnResumen = document.getElementById('btnResumen');
    const loadingSection = document.getElementById('loading');
    const errorSection = document.getElementById('error');
    const errorMensaje = document.getElementById('errorMensaje');
    const resultadoSection = document.getElementById('resultado');
    const frasesContainer = document.getElementById('frasesResumen');

    btnResumen.addEventListener('click', async () => {
        const textoOriginal = textoTextArea.value.trim();
        let cantidadOraciones = parseInt(nroFrasesInput.value);

        if (!textoOriginal) {
            mostrarError('Por favor, ingresa un texto para poder generar el resumen.');
            return;
        }

        if (isNaN(cantidadOraciones) || cantidadOraciones < 1) {
            cantidadOraciones = 2;
            if (nroFrasesInput) { nroFrasesInput.value = '2' }
        }

        ocultarSecciones();
        loadingSection.style.display = 'block';
        btnResumen.disabled = true;

        try {
            const respuesta = await fetch('/api/resumen/resumir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ texto: textoOriginal, numOraciones: cantidadOraciones })
            });

            const data = await respuesta.json();

            if (!respuesta.ok || !data.success) {
                throw new Error(data.error || 'Ocurrió un error inesperado al procesar el resumen.');
            }

            renderizarResultados(data.data);

        } catch (error) {
            mostrarError(error.message);
        } finally {
            loadingSection.style.display = 'none';
            btnResumen.disabled = false;
        }
    });

    function renderizarResultados(data) {
        frasesContainer.innerHTML = '';

        data.resumen.forEach((frase, indice) => {
            const fraseCard = document.createElement('div');
            fraseCard.className = 'frase-card';

            fraseCard.innerHTML = `
                <div class="frase-num">${indice + 1}</div>
                <div class="frase-text">${frase}</div>
            `;
            frasesContainer.appendChild(fraseCard);
        });

        resultadoSection.style.display = 'block';
    }

    function mostrarError(mensaje) {
        ocultarSecciones();
        errorMensaje.textContent = mensaje;
        errorSection.style.display = 'block';
    }

    function ocultarSecciones() {
        loadingSection.style.display = 'none';
        errorSection.style.display = 'none';
        resultadoSection.style.display = 'none';
    }
});