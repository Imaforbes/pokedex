// 1. Seleccionamos todos los elementos del DOM que vamos a necesitar al inicio.
const searchForm = document.getElementById('search-form');
const pokeNameInput = document.getElementById('pokeNameInput');
const pokeImg = document.getElementById('pokeImg');
const pokeNameDisplay = document.getElementById('name');
const pokeAbilitiesDisplay = document.getElementById('abilities');
const defaultImage = './Resources/pokebola.jpg';
const errorImage = './Resources/error.png'; // Asegúrate de tener una imagen de error

// 2. Función principal asíncrona para buscar el Pokémon.
const fetchPokemon = async (pokemonName) => {
    // Si la búsqueda está vacía, reseteamos la Pokédex.
    if (!pokemonName) {
        resetPokedex();
        return;
    }

    // Usamos try...catch para un mejor manejo de errores.
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
        const response = await fetch(url);

        // Si el Pokémon no se encuentra (error 404), mostramos un error.
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('¡Pokémon no encontrado!');
            } else {
                throw new Error('Error en la red.');
            }
        }

        const data = await response.json();
        updatePokedex(data);

    } catch (error) {
        handleSearchError(error.message);
    }
};

// 3. Función para actualizar la UI con los datos del Pokémon.
const updatePokedex = (data) => {
    pokeImg.src = data.sprites.front_default || defaultImage;
    pokeNameDisplay.textContent = data.name;

    // Limpiamos las habilidades anteriores.
    pokeAbilitiesDisplay.innerHTML = '';

    // Mapeamos y mostramos las nuevas habilidades.
    const abilitiesList = data.abilities.map(item => `<p>${item.ability.name}</p>`).join('');
    pokeAbilitiesDisplay.innerHTML = abilitiesList;
};

// 4. Función para manejar los errores de búsqueda.
const handleSearchError = (errorMessage) => {
    pokeImg.src = errorImage;
    pokeNameDisplay.textContent = 'Error';
    pokeAbilitiesDisplay.innerHTML = `<p>${errorMessage}</p>`;
};

// 5. Función para resetear la Pokédex a su estado inicial.
const resetPokedex = () => {
    pokeImg.src = defaultImage;
    pokeNameDisplay.textContent = '---';
    pokeAbilitiesDisplay.innerHTML = '';
};

// 6. Añadimos un event listener al formulario.
searchForm.addEventListener('submit', (event) => {
    // Prevenimos que la página se recargue al enviar el formulario.
    event.preventDefault();
    const pokemonName = pokeNameInput.value.trim();
    fetchPokemon(pokemonName);
});
