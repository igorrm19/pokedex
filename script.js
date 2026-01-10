
// Variaveis dos elementos
const nomePokemon = document.getElementById("pokemon-name");
const idPokemon = document.getElementById("pokemon-id");
const imagePokemon = document.getElementById("screen-bg");
const proximo = document.getElementById("proximo");
const anterior = document.getElementById("anterior");
const searchInput = document.getElementById("search-input");
const buttonSearch = document.getElementById("search-button");


// Variáveis comuns
let pokemonId = 0;
let pokemonAleatorio;
let pokemons;

// Funções
async function LoadingPokemons() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    return data.results;
}


async function nomeAleatorio() {
    pokemons = await LoadingPokemons();
    pokemonAleatorio = pokemons[Math.floor(Math.random() * pokemons.length)];

    pokemonId = pokemonAleatorio.url.split("/").at(-2);

    nomePokemon.textContent = pokemonAleatorio.name;
    idPokemon.textContent = `#${pokemonId}`;

    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    imagePokemon.setAttribute("href", imgUrl);


    console.log(
        "Pokemon:", pokemonAleatorio.name,
        "ID:", pokemonId,
        "IDanterior:", pokemonId - 1,
    );
}

function anteriorId() {
    pokemonId = Number(pokemonId) - 1;

    nomePokemon.textContent = pokemonAleatorio.name;
    idPokemon.textContent = `#${pokemonId}`;
    imagePokemon.setAttribute(
        "href",
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    );
}


// Eventos
console.log(pokemonId);
proximo.addEventListener("click", nomeAleatorio);
anterior.addEventListener("click", anteriorId);

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "a" || e.key === "A") {
        nomeAleatorio();
    }

    if (e.key === "ArrowLeft" || e.key === "b" || e.key === "B") {
        anteriorId();
    }
});


searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    if (!value) return;

    const foundPokemon = pokemons.find(
        (pokemon) => pokemon.name === value
    );

    if (!foundPokemon) return;

    pokemonId = foundPokemon.url.split("/").at(-2);

    nomePokemon.textContent = foundPokemon.name;
    idPokemon.textContent = `#${pokemonId}`;
    imagePokemon.setAttribute(
        "href",
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    );
});



nomeAleatorio();
