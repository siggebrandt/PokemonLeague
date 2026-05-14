let startPage = document.querySelector("#startPage");
let navBar = document.querySelector("#navBar");
let pokemonGrid = document.querySelector("#pokemonGrid");
let chosenGen = seasons[0];
numberOfSeason = seasons.length;

//Skapa navBar 
seasons.forEach((generation, index) => {
    //Loopar igenom alla säsonger och bygger själva knappen. Använder forEach så att jag kan använda index.
    let genButton = document.createElement("button");
    genButton.textContent = `Gen ${generation.year + 1}`
    navBar.appendChild(genButton)

    genButton.addEventListener("click", () => {
        chosenGen = seasons[index];
        renderPokemonGrid(chosenGen);
    })
    //console.log(generation, index)
})

//Skapade funktionen lite i efterhand för jag insåg att det blir mindre kod att bara anropa denna
//funktion när man ska bygga själva griden.
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

        //Appendar alla
        pokemonGrid.appendChild(pokemonCard);
        pokemonCard.appendChild(pokemonImg);
        pokemonCard.appendChild(pokemonName);

        //Hämtar en url från funktionen getPokemonImageUrl och lägger in the på image soruce.
        let imageUrl = getPokemonImageUrl(pokemon.dexNumber);
        pokemonImg.src = imageUrl;
        pokemonName.textContent = pokemon.pokemonName;
    })
}


//Funktion för att göra om siffran till en sträng och sedan retunera url som vi hämtar pokemon namn + bild.
function getPokemonImageUrl(dexNumber) {
    let number = dexNumber.toString();
    //Kolla upp padStart om ni inte kan, väldigt simpelt. Jag anger bara att strängen ska max vara 4 tecken lång och fylla i med nollor tills det blir det.
    number = number.padStart(4, `0`);
    let url = `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${number}/Normal.png`
    return url
}

//Funktion som uppdaterar pokemon griden utefter vilken generation som är vald. Tar emot en 
//generation som argument. Tillexempel när användaren klickar på en generation så kommer denna att
//anropas.
function renderPokemonGrid(gen) {
    //Kollar om gen är null, om true så visar griden alla pokemons.
    if (gen === null) {
        createPokemonCards(participants);
    } else {
        //Mappar denna generations pokemons och skapar då en ny arrat med alla aktivas id
        let pokemonIdArray = gen.coaches.map((coach) => coach.participantId);
        console.log(pokemonIdArray)
        //Filtrerar participants för att se vilka id:en som matchar och retunerar en ny array med
        //alla pokemons där vilkoret uppfylls.
        let thisGenPokemons = participants.filter((pokemon) => pokemonIdArray.includes(pokemon.id));
        console.log(thisGenPokemons);
        createPokemonCards(thisGenPokemons);
    }
}
renderPokemonGrid(null);

