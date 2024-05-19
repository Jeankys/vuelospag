document.addEventListener('DOMContentLoaded', () => {
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const sugerenciasOrigen = document.getElementById('sugerenciasOrigen');
    const sugerenciasDestino = document.getElementById('sugerenciasDestino');
    const listaVuelos = document.getElementById('listaVuelos');
    const mostrarVuelosBtn = document.getElementById('mostrarVuelos');

    origenInput.addEventListener('input', () => actualizarSugerencias(origenInput, sugerenciasOrigen));
    destinoInput.addEventListener('input', () => actualizarSugerencias(destinoInput, sugerenciasDestino));

    function actualizarSugerencias(input, sugerencias) {
        const valor = input.value.toLowerCase();
        sugerencias.innerHTML = '';
        if (valor) {
            const coincidencias = countries.filter(pais => pais.toLowerCase().includes(valor));
            coincidencias.forEach(pais => {
                const li = document.createElement('li');
                li.textContent = pais;
                li.addEventListener('click', () => {
                    input.value = pais;
                    sugerencias.innerHTML = '';
                });
                sugerencias.appendChild(li);
            });
        }
    }

    function cargarVuelos() {
        fetch('/api/vuelos')
            .then(response => response.json())
            .then(vuelos => {
                listaVuelos.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
                vuelos.forEach(vuelo => agregarVueloALaLista(vuelo));
            })
            .catch(error => console.error('Error al cargar los vuelos:', error));
    }

    function agregarVueloALaLista(vuelo) {
        const li = document.createElement('li');
        li.innerHTML = `Origen: ${vuelo.origen}, Destino: ${vuelo.destino}, Día: ${vuelo.dia}`;
        listaVuelos.appendChild(li);
    }

    document.getElementById('reservaForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        const dia = document.getElementById('dia').value;
        
        const vuelo = { origen, destino, dia };
        console.log('Datos del vuelo a enviar:', vuelo);

        fetch('/api/vuelos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vuelo)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            agregarVueloALaLista(data);
        })
        .catch(error => console.error('Error en la petición:', error));
    });

    // Evento del botón para mostrar los vuelos agendados
    mostrarVuelosBtn.addEventListener('click', function() {
        cargarVuelos();
    });
});
