

const pokemonPage = document.getElementById("pokemon-page");
const pokemonPageHeader = document.getElementById("pokemon-page-header");
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
const pokemonPageScoreSvg = document.getElementById("pokemon-page-score-svg");
const pokemonPageTable = document.getElementById("pokemon-page-table");
const pokemonPageTableLabels = document.getElementById("table-labels");
const tableRoundLabel = document.getElementById("round-label");
const tableDateLabel = document.getElementById("date-label");
const tableScoreLabel = document.getElementById("score-label");
const tablePlacementLabel = document.getElementById("placement-label");

//STARTSIDA
//GYMSIDA -- rardar chart

let radarChartSvg = document.querySelector("#radarChartSvg");
let radarChartHoverDiv = document.querySelector("#radarChartHoverDiv");
let radarChartSkillDisplay = document.querySelector("#radarChartSkillDisplay");

function createRadarChart(gym) {
    //Loopar igenom skillfactors och pushar in value för varje skill i en ny array
    let skillPoints = [];
    for (let skill in gym.skillFactors) {
        skillPoints.push(gym.skillFactors[skill]);
    }
    let dots = [];
    //Mitt punkten av svg, den är 400 bred och hög.
    let centerPoint = 200;
    let numOfSkills = skillPoints.length
    //2 * PI är 360 grader. Delar det på hur många skills som finns, i detta fall blir det 5.
    let anglePerSkill = (2 * Math.PI) / numOfSkills;

    //Variable som jag ändrar beroende på hur stort jag vill att svg ska vara
    let scale = 7.5;
    //Sätter en maxRadius för att max skill är 21 så den får inte vara större eller mindre än det.
    let maxRadius = 21 * scale;

    //Ritar nätet bakom huvudpolygonen i olika storlekar.
    drawBackgroundPolygon(maxRadius * 0.25, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(maxRadius * 0.50, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(maxRadius * 0.75, numOfSkills, anglePerSkill, centerPoint);
    drawBackgroundPolygon(maxRadius, numOfSkills, anglePerSkill, centerPoint);

    skillPoints.forEach((skill, index) => {
                //console.log(skill, index)
        //Räknar ut vinkeln för denna punkt. - Math.PI / 2 gör så att första punkten börjar högst upp.
        let angle = index * anglePerSkill - Math.PI / 2;
        //x och y är kordinater för punkten. Skill * scale skalar upp värdet så det är synligt men man hade
        //kunnat skriva utan, men man hade knappt sett något.
        //Math.cos och .sin omvandlar vinkeln till en riktning. .cos i x led och .sin i y led.
        let x = centerPoint + Math.cos(angle) * skill * scale;
        let y = centerPoint + Math.sin(angle) * skill * scale;
        dots.push(`${x},${y}`);
    })

    //ritar polygonen 
    d3.select(radarChartSvg)
    .append("polygon")
    .attr("points", dots.join(" "))
    .attr("fill", `${gym.color}`)
    .attr("fill-opacity", 0.1)
    .attr("stroke", `${gym.color}`)
    .attr("stroke-width", 2)

    //lägger till bild och text
    skillPoints.forEach((skill, index) => {
        let angle = index * anglePerSkill - Math.PI / 2;
        let x = centerPoint + Math.cos(angle) * skill * scale;
        let y = centerPoint + Math.sin(angle) * skill * scale;
                //x och y här är kordinater för texten. Jag multiplicerar inte med skill här för texten
        //ska inte röra sig om det är ett specifikt värde, utan den ska alltid vara på samma plats. 
        let textX = centerPoint + Math.cos(angle) * (maxRadius + 15);
        let textY = centerPoint + Math.sin(angle) * (maxRadius + 15);

        d3.select(radarChartSvg)
            .append("image")
            .attr("href", "bilder/2233235_0c846.png")
            .attr("x", x - 17.5)
            .attr("y", y - 17.5)
            .attr("height", 35)
            .attr("width", 35)
            .on("mouseover", (event) => {
                radarChartHoverDiv.style.display = "block";
                radarChartHoverDiv.style.backgroundColor = gym.color
                radarChartHoverDiv.style.borderRadius = "4px"
                radarChartHoverDiv.style.left = event.clientX + "px";
                radarChartHoverDiv.style.top = event.clientY + "px";
                radarChartHoverDiv.innerHTML = `
                <p>${skills[index].fullName}</p>
                <div style="display:flex">
                <img src="bilder/2233235_0c846.png" width="20" height="20"></img> <p>${skill}</p>
                </div>
                `;
            })
            .on("mousemove", (event) => {
                radarChartHoverDiv.style.left = event.clientX + "px";
                radarChartHoverDiv.style.top = event.clientY + "px"
            })
            .on("mouseout", (event) => {
                radarChartHoverDiv.style.display = "none"
            })

        d3.select(radarChartSvg)
            .append("text")
            .attr("x", textX)
            .attr("y", textY)
            .text(skills[index].name)
            .attr("text-anchor", "middle")
    })

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

function createSkillList(gym) {
    radarChartSkillDisplay.innerHTML = ``
    let skillPoints = [];
    console.log(gym.skillFactors)
    for(let skill in gym.skillFactors) {
        skillPoints.push(gym.skillFactors[skill])
    }

    skills.forEach((skill, index) => {

        //skapar element
        let skillRow = document.createElement("div");
        let leftSkill = document.createElement("div");
        let leftImage = document.createElement("img");
        let leftText = document.createElement("p");
        let rightSkill = document.createElement("div");
        let rightBar = document.createElement("div");
        let innerBar = document.createElement("div");
        let rightValue = document.createElement("p");

        //Appendar element
        radarChartSkillDisplay.appendChild(skillRow);
        skillRow.appendChild(leftSkill);
        skillRow.appendChild(rightSkill);
        leftSkill.appendChild(leftImage);
        leftSkill.appendChild(leftText);
        rightSkill.appendChild(rightBar);
        rightBar.appendChild(innerBar);
        rightSkill.appendChild(rightValue);

        //Ger klasser
        skillRow.classList.add("skillRow");
        leftSkill.classList.add("leftSkill");
        leftImage.classList.add("leftImage");
        leftText.classList.add("leftText");
        rightSkill.classList.add("rightSkill");
        rightBar.classList.add("rightBar");
        innerBar.classList.add("innerBar");
        rightValue.classList.add("rightValue");

        //elementens innehåll
        leftImage.src = "bilder/2233235_0c846.png";
        leftText.textContent = `${skill.fullName}`;
        innerBar.style.width = `${(skillPoints[index] / 21) * 100}%`;
        innerBar.style.height = "100%";
        innerBar.style.backgroundColor = gym.color;
        innerBar.style.borderRadius = "4px"
        rightValue.textContent = `${skillPoints[index]}`;
    })
}


//GYMSIDA




















































































































































































function renderPokemonPage(pokemon) {
    // Fyller i generation och tränare på vänster sida av navbaren.
    pokemonPageArrowBack.addEventListener("click", function () {
    body.classList.remove("pokemon-page-background");
    pokemonPage.classList.add("hide");
    startPage.classList.remove("hide");
});

pokemonPageHeader.style.backgroundColor = pokemon.colors[0];
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

        trainerNameDiv.style.backgroundColor = pokemon.colors[1];
        trainerNameDiv.style.color = pokemon.colors[2];
        disciplineNameDiv.style.backgroundColor = pokemon.colors[1];
        disciplineNameDiv.style.color = pokemon.colors[2];

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

    /* seasons.forEach((generation, index) => {
    let genButton = document.createElement("button");
    genButton.textContent = `Gen ${generation.year + 1}`
        navBar.appendChild(genButton)


    genButton.addEventListener("click", () => {
        chosenGen = seasons[index];
        currentGen = [chosenGen];
        console.log(currentGen, "hej")
        renderPokemonGrid(chosenGen);
        renderGymPageGenStats(chosenGen);
            generationTitle.textContent = `Generation ${generation.year + 1} - ${genNameArray[index]}`;
            pokemonSmallTitle.textContent = `Participating Pokemons - gen ${generation.year + 1}`;
    })


}) */

    seasons.forEach(season => {
const genButton = document.createElement("button");
genButton.textContent = `Gen ${season.year + 1}`;
    })
};

function renderPokemonMainData() {
    pokemonPageScoreSvg.textContent = "";

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

    const width = 600;
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


    //Fyller i tabellen
  while (pokemonPageTable.children.length > 1) {
        pokemonPageTable.lastElementChild.remove();
    };

    pokemonPageTableLabels.style.backgroundColor = pokemon.colors[0];

    for (let i = 0; i < scoreAndDateData.length; i += 10) {
        const tableRow = document.createElement("div");
        tableRow.classList.add("table-row");

        const roundDiv = document.createElement("div");
        roundDiv.classList.add("table-value");
        roundDiv.classList.add("round-value");
        roundDiv.textContent = `Round ${i + 1}`;

        const dateDiv = document.createElement("div");
        dateDiv.classList.add("table-value");
        dateDiv.classList.add("date-value");
        dateDiv.textContent = scoreAndDateData[i].date;

        const scoreDiv = document.createElement("div");
        scoreDiv.classList.add("table-value");
        scoreDiv.classList.add("score-value");
        scoreDiv.textContent = scores[i];

        const placementDiv = document.createElement("div");
        placementDiv.classList.add("table-value");
        placementDiv.textContent = allPlacements[i];

        tableRow.append(roundDiv);
        tableRow.append(dateDiv);
        tableRow.append(scoreDiv);
        tableRow.append(placementDiv);

        pokemonPageTable.append(tableRow);
    }

    const tableBottomDiv = document.createElement("div");
    tableBottomDiv.classList.add("last-row");
    tableBottomDiv.style.backgroundColor = pokemon.colors[0];

    pokemonPageTable.append(tableBottomDiv);
}