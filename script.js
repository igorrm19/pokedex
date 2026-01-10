const nomePokemon = document.getElementById("pokemon-name");
const idPokemon = document.getElementById("pokemon-id");
const imagePokemon = document.getElementById("screen-bg");

async function LoadingPokemons() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    return data.results;
}



async function nomeAleatorio() {
    const pokemons = await LoadingPokemons();
    const pokemonAleatorio = pokemons[Math.floor(Math.random() * pokemons.length)];

    const pokemonId = pokemonAleatorio.url.split("/").at(-2);

    nomePokemon.textContent = pokemonAleatorio.name;
    idPokemon.textContent = `#${pokemonId}`;

    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    imagePokemon.setAttribute("href", imgUrl);

    console.log(
        "Pokemon:", pokemonAleatorio.name,
        "ID:", pokemonId,
    );
}


nomeAleatorio();
