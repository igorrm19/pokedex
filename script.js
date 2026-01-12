const nomePokemon = document.getElementById("pokemon-name");
const idPokemon = document.getElementById("pokemon-id");
const imagePokemon = document.getElementById("screen-bg");
const proximo = document.getElementById("proximo");
const anterior = document.getElementById("anterior");
const searchInput = document.getElementById("search-input");
const searchInput2 = document.getElementById("search-input-2");
const animateDef = document.getElementById("animate-defense-bar");
const animateHp = document.getElementById("animate-hp-bar");
const animateAttack = document.getElementById("animate-attack-bar");
const pokemonType = document.getElementById("pokemon-type");
const buttonVerTodos = document.getElementById("ver-todos");
const listaTodosPokemons = document.getElementById("lista-todos-pokemons");
const svg = document.querySelector(".pokedex svg");
const form = document.querySelector("form");

let pokemonId = 0;
let pokemons;
let pokemonAtual;

form.addEventListener("submit", e => e.preventDefault());

async function LoadingPokemons() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await res.json();
    return data.results;
}

async function renderPokemon(url) {
    const res = await fetch(url);
    const data = await res.json();

    pokemonId = data.id;

    nomePokemon.textContent = data.name.toUpperCase();
    idPokemon.textContent = `#${data.id}`;
    imagePokemon.setAttribute("href", data.sprites.front_default);
    pokemonType.textContent = data.types[0].type.name;

    animateHp.setAttribute("to", data.stats[0].base_stat);
    animateAttack.setAttribute("to", data.stats[1].base_stat);
    animateDef.setAttribute("to", data.stats[2].base_stat);

    svg.querySelectorAll("animate").forEach(a => a.beginElement());
}

async function nomeAleatorio() {
    if (!pokemons) pokemons = await LoadingPokemons();
    pokemonAtual = pokemons[Math.floor(Math.random() * pokemons.length)];
    await renderPokemon(pokemonAtual.url);
}

async function anteriorId() {
    if (!pokemonId) return;
    pokemonId--;
    if (pokemonId < 1) pokemonId = 151;
    await renderPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
}

searchInput.addEventListener("input", async () => {
    const valor = searchInput.value.toLowerCase().trim();
    if (!valor) return;
    if (!pokemons) pokemons = await LoadingPokemons();
    const achado = pokemons.find(p => p.name.startsWith(valor));
    if (!achado) return;
    await renderPokemon(achado.url);
});

async function gerarTodosPokemons() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    document.getElementById("pokedex").style.display = "none";
    buttonVerTodos.style.display = "none";
    searchInput.style.display = "none";
    searchInput2.style.display = "block";
    svg.style.display = "none";

    if (!pokemons) pokemons = await LoadingPokemons();

    listaTodosPokemons.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {
        const res = await fetch(pokemons[i].url);
        const data = await res.json();

        const wrapper = document.createElement("div");
        const clone = svg.cloneNode(true);

        clone.style.position = "static";
        clone.style.top = "0";
        clone.style.left = "0";
        clone.style.transform = "none";
        clone.style.display = "block";
        clone.style.margin = "20px auto";
        clone.style.maxWidth = "360px";

        clone.dataset.nome = data.name.toLowerCase();
        clone.dataset.id = String(data.id);
        clone.dataset.tipo = data.types[0].type.name.toLowerCase();

        clone.querySelector("#pokemon-name").textContent = data.name.toUpperCase();
        clone.querySelector("#pokemon-id").textContent = `#${data.id}`;
        clone.querySelector("#screen-bg").setAttribute("href", data.sprites.front_default);
        clone.querySelector("#pokemon-type").textContent = data.types[0].type.name;

        const calc = v => (v / 255) * 200;

        clone.querySelector("#animate-hp-bar").setAttribute("to", calc(data.stats[0].base_stat));
        clone.querySelector("#animate-attack-bar").setAttribute("to", calc(data.stats[1].base_stat));
        clone.querySelector("#animate-defense-bar").setAttribute("to", calc(data.stats[2].base_stat));

        wrapper.appendChild(clone);
        listaTodosPokemons.appendChild(wrapper);

        clone.querySelectorAll("animate").forEach(a => a.beginElement());
    }
}

searchInput2.addEventListener("input", () => {
    const valor = searchInput2.value.toLowerCase().trim();
    const cards = listaTodosPokemons.children;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i].firstChild;
        const nome = card.dataset.nome;
        const id = card.dataset.id;
        const tipo = card.dataset.tipo;

        if (!valor || nome.includes(valor) || id.includes(valor) || tipo.includes(valor)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
});

buttonVerTodos.addEventListener("click", gerarTodosPokemons);
proximo.addEventListener("click", nomeAleatorio);
anterior.addEventListener("click", anteriorId);

window.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === "a" || e.key === "A") nomeAleatorio();
    if (e.key === "ArrowLeft" || e.key === "b" || e.key === "B") anteriorId();
});

nomeAleatorio();
