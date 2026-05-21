const body = document.querySelector("body");

let startPage = document.querySelector("#startPage");
let navBar = document.querySelector("#navBar");
let pokemonGrid = document.querySelector("#pokemonGrid");
let gymCardContainer = document.querySelector("#gymCardContainer")
let chosenGen = seasons[0];
let gymPage = document.querySelector("#gymPage");

const pokemonPage = document.getElementById("pokemon-page");
const pokemonPageArrowBack = document.getElementById("pokemon-page-arrow-back");
const pokemonPicture = document.getElementById("pokemon-picture");
const pokemonLabelsContainer = document.getElementById("labels-container");
const pokemonNameLabel = document.getElementById("pokemon-name-label");
const pokemonGenLabel = document.getElementById("generation-label");
const trainerNameLabel = document.getElementById("trainer-name-label");
const trainerSkillLabel = document.getElementById("trainer-skill-label");
const pokemonTopScore = document.getElementById("pokemon-top-score");
const pokemonTotalScore = document.getElementById("pokemon-total-score");
const pokemonTopPlacement = document.getElementById("pokemon-top-placement");
const mainPokemonPage = document.getElementById("pokemon-page-main");
const pokemoPageScoreSvg = document.getElementById("pokemon-page-score-svg");

numberOfSeason = seasons.length;
let currentGen = seasons;

//STARTSIDA
//Skapa navBar 
seasons.forEach((generation, index) => {
    //Loopar igenom alla säsonger och bygger själva knappen. Använder forEach så att jag kan använda index.
    let genButton = document.createElement("button");
    genButton.textContent = `Gen ${generation.year + 1}`
    navBar.appendChild(genButton)

    genButton.addEventListener("click", () => {
        chosenGen = seasons[index];
        currentGen = [chosenGen];
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
            body.classList.add("pokemon-page-background");
            startPage.classList.add("hide");
            pokemonPage.classList.remove("hide");
            pokemonPicture.style.backgroundImage = `url(${imageUrl})`;

            renderPokemonPage(pokemon);
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
//GYMSIDA




















































































































































































function renderPokemonPage(pokemon) {
    // Fyller i generation och tränare på vänster sida av navbaren.
    pokemonNameLabel.textContent = pokemon.pokemonName;

    //Kollar först om vi valt en generation, då blir currentGen.length 1. Om vi inte valt någon generation visas alla (ALL == NaN).
    const getCurrentGenNumber = currentGen.length === 1 ? currentGen.map(gen => gen.year + 1) : NaN;
    pokemonGenLabel.textContent = getCurrentGenNumber ? `Generation ${getCurrentGenNumber}` : "All Generations";

    while (pokemonLabelsContainer.children.length > 1) {
        pokemonLabelsContainer.lastElementChild.remove();
    };

    const currentTrainersId = currentGen.map(gen => gen.trainers.find(trainer => trainer.participantId === pokemon.id)).filter(trainer => trainer != undefined).map(trainer => trainer.trainerId);
    const trainerNames = currentTrainersId.map(trainer => trainers.find(t => t.id === trainer)).map(trainer => trainer.name);
    const trainerDisciplineId = currentTrainersId.map(trainer => trainers.find(t => t.id === trainer)).map(trainer => trainer.disciplineId);
    const disciplineNames = trainerDisciplineId.map(trainer => disciplines.find(discipline => discipline.id === trainer)).map(discipline => discipline.name);

    for (let i = 0; i < trainerNames.length; i++) {
        const trainerNameDiv = document.createElement("div");
        const disciplineNameDiv = document.createElement("div");
        trainerNameDiv.classList.add("label");
        disciplineNameDiv.classList.add("label");
        trainerNameDiv.classList.add("trainer-label");
        disciplineNameDiv.classList.add("trainer-label");
        trainerNameDiv.textContent = trainerNames[i];
        disciplineNameDiv.textContent = disciplineNames[i];
        pokemonLabelsContainer.append(trainerNameDiv);
        pokemonLabelsContainer.append(disciplineNameDiv);
    };


    // Fyller i poäng och placering på höger sida av navbaren.

    // Kolla upp .flatMap, med .map får man en massa arrayer inuti arrayer t.ex: [[1], [2], [3], [4]], men med.flatMap samlas alla scores t.ex såhär: [1, 2, 3, 4].
    const scores = currentGen.flatMap(gen => gen.competitionDays).flatMap(day => day.events).flatMap(event => event.scores).filter(score => score.participantId === pokemon.id).flatMap(id => id.score);

    // Räknar ut vilket som var pokemonens högsta score.
    let highscore = 0;
    scores.forEach(score => {
        highscore = score > highscore ? score : highscore;
    })
    pokemonTopScore.textContent = `${highscore}`;

    // Räknar ihop alla scores pokemonen fått.
    const totalScore = scores.reduce((acc, current) => {
        return acc + current;
    }, 0);
    pokemonTotalScore.textContent = `${totalScore}`;

    // Jämför min valda pokemons score med de andra i samma omgång för att ta reda på vilken runda den spelade bäst i.
    const gameDays = currentGen.flatMap(gen => gen.competitionDays).flatMap(day => day.events).map(event => event.scores).filter(score => score.some(participant => participant.participantId === pokemon.id));

    let allPlacements = [];
    let gameDayIndex = 0;
    for (let score of scores) {
        const betterParticipants = gameDays[gameDayIndex].filter(game => game.score > score);
        const myPlacement = betterParticipants.length > 0 ? betterParticipants.length + 1 : 1;
        allPlacements.push(myPlacement);
        gameDayIndex++;
    }

    let myTopPlacement = 6;
    for (let placement of allPlacements) {
        if (myTopPlacement > placement) myTopPlacement = placement;
    }
    pokemonTopPlacement.textContent = `#${myTopPlacement}`;


    // Skapar svg
    pokemoPageScoreSvg.textContent = "";

    const svgData = [];
    for (let i = 0; i < scores.length; i++) {
        const dataObject = { x: i + 1, y: scores[i] };
        svgData.push(dataObject);
    };

    const scoreAndDateData = [];
    const g = currentGen.filter(gen => gen.competitionDays.forEach(day => {
        const scoreAndDate = { date: `${day.date.day}/${day.date.month}` };
        day.events.forEach(event => {
            event.scores.forEach(score => {
                if (score.participantId === pokemon.id) {
                    scoreAndDate.score = score.score;
                    scoreAndDateData.push(scoreAndDate);
                }
            })
        })
    }));

    const width = 1200;
    const height = 400;
    const margin = 40;


    const svg = d3.select("#pokemon-page-score-svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleBand()
        .domain(d3.map(scoreAndDateData, data => data.date))
        .range([margin, width - margin]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(scoreAndDateData, data => data.score) - 50, d3.max(scoreAndDateData, data => data.score) + 50])
        .range([height - margin, margin]);

    const line = d3.line()
        .x(data => xScale(data.date) + xScale.bandwidth() / 2)
        .y(data => yScale(data.score));

    svg.append("path")
        .datum(scoreAndDateData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", line);

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px")
        .style("border", "1px solid black")
        .style("display", "none");

    svg.selectAll("image")
        .data(scoreAndDateData.filter((d, i) => i % 10 === 0))
        .enter()
        .append("image")
        .attr("href", "bilder/2233235_0c846.png")
        .attr("x", d => xScale(d.date) + xScale.bandwidth() / 2 - 15)
        .attr("y", d => yScale(d.score) - 15)
        .attr("width", 30)
        .attr("height", 30)
        .on("mouseover", function (event, d) {
            tooltip
                .style("display", "block")
                .html(`Score: ${d.score}`);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
        });

    const xAxis = d3.axisBottom(xScale)
        .tickValues(
            xScale.domain().filter((d, i) => i % 10 === 0)
        );

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text("Score over time");
}

pokemonPageArrowBack.addEventListener("click", function () {
    body.classList.remove("pokemon-page-background");
    pokemonPage.classList.add("hide");
    startPage.classList.remove("hide");
})