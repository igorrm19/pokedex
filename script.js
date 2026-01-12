// Variaveis dos elementos

const nomePokemon = document.getElementById("pokemon-name");
const idPokemon = document.getElementById("pokemon-id");
const imagePokemon = document.getElementById("screen-bg");
const proximo = document.getElementById("proximo");
const anterior = document.getElementById("anterior");
const searchInput = document.getElementById("search-input");
const animateDef = document.getElementById("animate-defense-bar");
const animateHp = document.getElementById("animate-hp-bar");
const animateAttack = document.getElementById("animate-attack-bar");
const pokemonType = document.getElementById("pokemon-type");
const buttonVerTodos = document.getElementById("ver-todos");
const svg = document.querySelector("svg");
const searchInput2 = document.getElementById("search-input-2");
const listaTodosPokemons = document.getElementById("lista-todos-pokemons");

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


    const pokemonStatsResponse = await fetch(pokemonAleatorio.url);
    const pokemonStatsData = await pokemonStatsResponse.json();
    console.log(pokemonStatsData);


    animateHp.setAttribute("to", pokemonStatsData.stats[0].base_stat);
    animateAttack.setAttribute("to", pokemonStatsData.stats[1].base_stat);
    animateDef.setAttribute("to", pokemonStatsData.stats[2].base_stat);


    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    imagePokemon.setAttribute("href", imgUrl);

    pokemonType.textContent = pokemonStatsData.types[0].type.name;
}

async function anteriorId() {
    pokemonId = Number(pokemonId) - 1;

    nomePokemon.textContent = pokemonAleatorio.name;
    idPokemon.textContent = `#${pokemonId}`;

    const pokemonStatsResponse = await fetch(pokemonAleatorio.url);
    const pokemonStatsData = await pokemonStatsResponse.json();

    imagePokemon.setAttribute("href", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`);

    animateHp.setAttribute("to", pokemonStatsData.stats[0].base_stat);
    animateAttack.setAttribute("to", pokemonStatsData.stats[1].base_stat);
    animateDef.setAttribute("to", pokemonStatsData.stats[2].base_stat);

    pokemonType.textContent = pokemonStatsData.types[0].type.name;
}


async function gerarTodosPokemons() {

    document.body.style.overflowY = "auto";
    document.body.style.height = "auto";


    document.getElementById("pokedex").style.display = "none";
    document.getElementById("ver-todos").style.display = "none";
    document.getElementById("search-input").style.display = "none";
    document.getElementById("search-input-2").style.display = "block";

    if (!pokemons) {
        pokemons = await LoadingPokemons();
    }

    for (let i = 0; i < pokemons.length; i++) {
        const pokemonBase = pokemons[i];
        const clone = svg.cloneNode(true);

        const res = await fetch(pokemonBase.url);

        if (!res.ok) {
            console.error(`Falha ao buscar o Pokémon da URL: ${pokemonBase.url}`);
            continue;
        }

        const data = await res.json();
        const id = data.id;


        clone.id = `pokedex-pokemon-${id}`;
        clone.style.display = "block";
        clone.style.marginBottom = "20px";
        clone.style.marginTop = "20px";
        clone.style.width = "100%";
        clone.style.maxWidth = "360px";

        clone.querySelector("#pokemon-name").textContent = data.name.toUpperCase();
        clone.querySelector("#pokemon-id").textContent = `#${id}`;
        clone.querySelector("#screen-bg").setAttribute("href", data.sprites.front_default);
        clone.querySelector("#pokemon-type").textContent = data.types[0].type.name;


        const larguraMax = 200;
        const calcWidth = (baseStat) => (baseStat / 255) * larguraMax;

        clone.querySelector("#animate-hp-bar").setAttribute("to", calcWidth(data.stats[0].base_stat));
        clone.querySelector("#animate-attack-bar").setAttribute("to", calcWidth(data.stats[1].base_stat));
        clone.querySelector("#animate-defense-bar").setAttribute("to", calcWidth(data.stats[2].base_stat));


        listaTodosPokemons.appendChild(clone);

        clone.querySelectorAll("animate").forEach(anim => anim.beginElement());
    }
}


// Eventos (inalterados)

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

    const foundPokemon = pokemons.find((pokemon) => pokemon.name === value);

    if (!foundPokemon) return;

    pokemonId = foundPokemon.url.split("/").at(-2);
    nomePokemon.textContent = foundPokemon.name;

    idPokemon.textContent = `#${pokemonId}`;
    imagePokemon.setAttribute("href", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`);
});



buttonVerTodos.addEventListener("click", () => {
    gerarTodosPokemons();
});


nomeAleatorio();
