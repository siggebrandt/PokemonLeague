const body = document.querySelector("body");

let startPage = document.querySelector("#startPage");
let navBar = document.querySelector("#navBar");
let pokemonGrid = document.querySelector("#pokemonGrid");
let gymCardContainer = document.querySelector("#gymCardContainer");
let chosenGen = seasons[0];
let gymPage = document.querySelector("#gymPage");
let generationTitle = document.querySelector("#generationText");
let pokemonSmallTitle = document.querySelector("#pokemonSmallTitle");

numberOfSeason = seasons.length;
let currentGen = seasons;
let currentPokemon = "";
let genNameArray = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Paldea",
  "Kitakami",
];
//STARTSIDA
seasons.forEach((generation, index) => {
  let genButton = document.createElement("button");
  genButton.textContent = `Gen ${generation.year + 1}`;
  navBar.appendChild(genButton);

  genButton.addEventListener("click", () => {
    gymCardContainer.classList.remove("no-click");
    pokemonGrid.classList.remove("no-click");
    document.querySelectorAll("#navBar button").forEach((button) => {
      button.classList.remove("navBarChosen");
    });

    genButton.classList.add("navBarChosen");

    chosenGen = seasons[index];
    currentGen = [chosenGen];

    renderPokemonGrid(chosenGen);
    renderGymPageGenStats(chosenGen);
    generationTitle.textContent = `Generation ${generation.year + 1} - ${genNameArray[index]}`;
    pokemonSmallTitle.textContent = `Participating Pokemons - gen ${generation.year + 1}`;
  });
});

disciplines.forEach((gym) => {
  let gymCard = document.createElement("div");
  let gymImage = document.createElement("img");
  let gymName = document.createElement("p");
  gymCard.classList.add("gymCards");
  gymImage.classList.add("gymImages");
  gymName.classList.add("gymNames");

  gymCardContainer.appendChild(gymCard);
  gymCard.appendChild(gymImage);
  gymCard.appendChild(gymName);

  gymImage.src = gym.image;
  gymName.textContent = gym.gymName;
  gymName.style.backgroundColor = gym.color;

  gymCard.addEventListener("click", () => {
    currentGym = gym;
    renderGymPage(gym, currentGen[0]);
  });
});

function createPokemonCards(pokemonArray) {
  pokemonGrid.innerHTML = "";
  pokemonArray.forEach((pokemon) => {
    //Skapar tre element för varje itteration
    let pokemonCard = document.createElement("div");
    let pokemonImg = document.createElement("img");
    let pokemonName = document.createElement("p");
    pokemonCard.classList.add("pokemonCard");
    pokemonImg.classList.add("pokemonCardImage");
    pokemonName.classList.add("pokemonName");

    pokemonGrid.appendChild(pokemonCard);
    pokemonCard.appendChild(pokemonImg);
    pokemonCard.appendChild(pokemonName);

    let imageUrl = getPokemonImageUrl(pokemon.dexNumber);
    pokemonImg.src = imageUrl;
    pokemonName.textContent = pokemon.pokemonName;

    pokemonCard.addEventListener("click", () => {
      body.classList.add("pokemon-page-background");
      startPage.classList.add("hide");
      pokemonPage.classList.remove("hide");
      pokemonPicture.style.backgroundImage = `url(${imageUrl})`;

      renderPokemonPage(pokemon);
      currentPokemon = pokemon;
    });
  });
}

function getPokemonImageUrl(dexNumber) {
  let number = dexNumber.toString();

  number = number.padStart(4, `0`);
  let url = `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${number}/Normal.png`;
  return url;
}

function renderPokemonGrid(gen) {
  if (gen === null) {
    createPokemonCards(participants);
  } else {
    let pokemonIdArray = gen.coaches.map((coach) => coach.participantId);

    let thisGenPokemons = participants.filter((pokemon) =>
      pokemonIdArray.includes(pokemon.id),
    );

    createPokemonCards(thisGenPokemons);
  }
}

renderPokemonGrid(null);
