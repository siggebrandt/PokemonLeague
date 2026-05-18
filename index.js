let startPage = document.querySelector("#startPage");
let navBar = document.querySelector("#navBar");
let pokemonGrid = document.querySelector("#pokemonGrid");
let gymCardContainer = document.querySelector("#gymCardContainer")
let chosenGen = seasons[0];
let gymPage = document.querySelector("#gymPage");
numberOfSeason = seasons.length;

//STARTSIDA
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

//Skapa gym korten. Funkar nästan exakt som funktionen nedan.
disciplines.forEach((gym) => {
    let gymCard = document.createElement("div");
    let gymImage = document.createElement("img");
    let gymName = document.createElement("p");
    gymCard.classList.add("gymCards");
    gymImage.classList.add("gymImages");
    gymName.classList.add("gymNames")

    //Append
    gymCardContainer.appendChild(gymCard);
    gymCard.appendChild(gymImage);
    gymCard.appendChild(gymName);

    gymImage.src = gym.image;
    gymName.textContent = gym.gymName;
    gymName.style.backgroundColor = gym.color;

    //Event listener
    gymCard.addEventListener("click", () => {
        renderGymPage(gym)
        //Här kanske man anropar någon funktion.
        //Kan till exempel stå renderGymPage(gym);
    })
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

        //Event listener
        pokemonCard.addEventListener("click", () => {
            //Här kanske man anropar någon funktion.
            //Kan till exempel stå renderPokemonPage(pokemon);
        })
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

//STARTSIDA
//GYMSIDA

let radarChartSvg = document.querySelector("#radarChartSvg");
function renderGymPage(gym) {
    console.log(gym)
    startPage.classList.add("hide");
    gymPage.classList.remove("hide");
    createRadarChart(gym);
}

function createRadarChart(gym) {
    //Loopar igenom skillfactors och pushar in value för varje skill i en ny array
    let skillPoints = [];
    for (let skill in gym.skillFactors) {
        skillPoints.push(gym.skillFactors[skill]);
    }
    let dots = [];
    //Mitt punkten av svg, den är 300 bred och hög.
    let centerPoint = 150;
    let numOfSkills = skillPoints.length
    //2 * PI är 360 grader. Delar det på hur många skills som finns, i detta fall blir det 5.
    let anglePerSkill = (2 * Math.PI) / numOfSkills;

    //Ritar nätet bakom huvudpolygonen i olika storlekar.
    drawBackgroundPolygon(25, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(50, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(75, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(100, numOfSkills, anglePerSkill, centerPoint);

    skillPoints.forEach((skill, index) => {
        //console.log(skill, index)
        //Räknar ut vinkeln för denna punkt. - Math.PI / 2 gör så att första punkten börjar högst upp.
        let angle = index * anglePerSkill - Math.PI / 2;
        //x och y är kordinater för punkten. Skill * 5 skalar upp värdet så det är synligt men man hade
        //kunnat skriva utan, men man hade knappt sett något.
        //Math.cos och .sin omvandlar vinkeln till en riktning. .cos i x led och .sin i y led.
        let x = centerPoint + Math.cos(angle) * skill * 5;
        let y = centerPoint + Math.sin(angle) * skill * 5;
        //x och y här är kordinater för texten. Jag multiplicerar inte med skill här för texten
        //ska inte röra sig om det är ett specifikt värde, utan den ska alltid vara på samma plats. 
        let textX = centerPoint + Math.cos(angle) * 120;
        let textY = centerPoint + Math.sin(angle) * 120;
        dots.push(`${x},${y}`);

        d3.select(radarChartSvg)
            .append("image")
            .attr("href", "bilder/2233235_0c846.png")
            .attr("x", x - 10)
            .attr("y", y - 10)
            .attr("height", 20)
            .attr("width", 20)
            .on("mouseover", () => {
                console.log(skill);
            })

        d3.select(radarChartSvg)
            .append("text")
            .attr("x", textX)
            .attr("y", textY)
            .text(skills[index].name)
            .attr("text-anchor", "middle")
    })

    d3.select(radarChartSvg)
        .append("polygon")
        .attr("points", dots.join(" "))
        .attr("fill", "rgba(255, 0, 0, 0.1)")
        .attr("stroke", "red")
        .attr("stroke-width", 2)


}

function drawBackgroundPolygon(distance, numOfSkills, anglePerSkill, centerPoint) {
    let backgroundDots = [];
    for (let i = 0; i < numOfSkills; i++) {
        let angle = i * anglePerSkill - Math.PI / 2;
        let x = centerPoint + Math.cos(angle) * distance;
        let y = centerPoint + Math.sin(angle) * distance;
        backgroundDots.push(`${x}, ${y}`);
    }
    d3.select(radarChartSvg)
        .append("polygon")
        .attr("points", backgroundDots.join(" "))
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1)
}

createRadarChart({
    id: 1,
    name: "D01",
    gymName: "Fire gym",
    color: "red",
    image: "bilder/fcf9d85f-9ff6-4bc5-9dc3-bce99de7f930.png",
    skillFactors: {
        S01: 13, S02: 12, S03: 14, S04: 17, S05: 20,
    },
})
//GYMSIDA
