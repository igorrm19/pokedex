

async function LoadingPokemons() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    return data.results;
}

async function nomeAleatorio() {
    const pokemons = await LoadingPokemons();
    const pokemonAleatorio = pokemons[Math.floor(Math.random() * pokemons.length)];

    const nomePokemon = document.getElementById("pokemon-name");
    nomePokemon.textContent = pokemonAleatorio.name;
}

nomeAleatorio();
