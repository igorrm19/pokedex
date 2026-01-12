
// Variaveis dos elementos

const nomePokemon = document.getElementById("pokemon-name");
const idPokemon = document.getElementById("pokemon-id");
const imagePokemon = document.getElementById("screen-bg");
const proximo = document.getElementById("proximo");
const anterior = document.getElementById("anterior");
const searchInput = document.getElementById("search-input");
const buttonSearch = document.getElementById("search-button");
const animateDef = document.getElementById("animate-defense-bar");
const animateHp = document.getElementById("animate-hp-bar");
const animateAttack = document.getElementById("animate-attack-bar");
const pokemonType = document.getElementById("pokemon-type");
const buttonVerTodos = document.getElementById("ver-todos");
const svg = document.querySelector("svg");
const searchInput2 = document.getElementById("search-input-2");


let svgClone;

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
    const pokemonStats = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const pokemonStatsResponse = await fetch(pokemonStats);
    const pokemonStatsData = await pokemonStatsResponse.json();
    console.log(pokemonStatsData);


    animateDef.setAttribute("to", pokemonStatsData.stats[0].base_stat);
    animateHp.setAttribute("to", pokemonStatsData.stats[1].base_stat);
    animateAttack.setAttribute("to", pokemonStatsData.stats[2].base_stat);

    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    imagePokemon.setAttribute("href", imgUrl);

    pokemonType.textContent = pokemonStatsData.types[0].type.name;

    console.log(
        "Pokemon:", pokemonAleatorio.name,
        "ID:", pokemonId,
        "IDanterior:", pokemonId - 1,
    );
}

async function anteriorId() {
    pokemonId = Number(pokemonId) - 1;

    nomePokemon.textContent = pokemonAleatorio.name;
    idPokemon.textContent = `#${pokemonId}`;
    const pokemonStats = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const pokemonStatsResponse = await fetch(pokemonStats);
    const pokemonStatsData = await pokemonStatsResponse.json();

    imagePokemon.setAttribute(
        "href",
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    );

    animateDef.setAttribute("to", pokemonStatsData.stats[0].base_stat);
    animateHp.setAttribute("to", pokemonStatsData.stats[1].base_stat);
    animateAttack.setAttribute("to", pokemonStatsData.stats[2].base_stat);
    pokemonType.textContent = pokemonStatsData.types[0].type.name;
}



// Eventos
// ... (seus event listeners para proximo/anterior/keydown/searchinput) ...

buttonVerTodos.addEventListener("click", () => {
    // Não precisa de muita alteração aqui, apenas chama a função
    copiaPokedex();
});

nomeAleatorio();



// Eventos

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


// Eventos de busca
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


buttonVerTodos.addEventListener("click", () => {
    svg.style.display = "none";
    buttonVerTodos.style.display = "none";
    searchInput.style.display = "none";
    searchInput2.style.display = "block";

    copiaPokedex();
});


nomeAleatorio();
