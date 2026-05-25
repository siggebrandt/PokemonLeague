const gymBanner = document.getElementById("gymBanner");

function renderGymPageGenStats(gen) {
  if (!currentGym || !gen) return;
  document.querySelector("#gymBannerTitle").textContent =
    `${currentGym.gymName} - Generation ${Number(gen.year) + 1}`;

  let pokemonsInGymAndGen = gymScoreCalculateFinalScore(currentGym, gen);
  gymScoreBoard(pokemonsInGymAndGen);

  createScatterPlot(currentGym, gen);
}

function renderGymPage(gym, gen) {
  currentGym = gym;
  document.getElementById("radarChartSvg").innerHTML = "";
  document.getElementById("radarChartSkillDisplay").innerHTML = "";

  startPage.classList.add("hide");
  gymPage.classList.remove("hide");

  document.querySelector("#gymBannerTitle").textContent =
    `${gym.gymName} - Generation ${Number(gen.year) + 1}`;

  gymBanner.style.backgroundColor = gym.color;
  document
    .querySelectorAll("#gymStatsScoreBoard table thead th")
    .forEach((th) => {
      th.style.backgroundColor = gym.color;
    });
  document.getElementById("gymStatsScoreBoardTitle").style.backgroundColor =
    gym.color;
  document.getElementById("gymStatsScatterPlotTitle").style.backgroundColor =
    gym.color;

  createRadarChart(gym);
  createSkillList(gym);
  let pokemonsInGymAndGen = gymScoreCalculateFinalScore(gym, gen);
  gymScoreBoard(pokemonsInGymAndGen);

  createScatterPlot(gym, gen);
}

function gymScoreCalculateFinalScore(gym, gen) {
  let participatingPokemons = [];
  gen.competitionDays.forEach((day) => {
    day.events.forEach((discipline) => {
      if (discipline.disciplineId == gym.id) {
        discipline.scores.forEach((participant) => {
          const index = participatingPokemons.findIndex((pokemon) => {
            return pokemon.id == participant.participantId;
          });

          if (index === -1) {
            participatingPokemons.push({
              id: participant.participantId,
              totalScore: participant.score,
            });
          } else {
            participatingPokemons[index].totalScore += participant.score;
          }
        });
      }
    });
  });
  participatingPokemons.sort((a, b) => {
    return b.totalScore - a.totalScore;
  });
  return participatingPokemons;
}

function pokemonIdToName(pokemonId) {
  const foundPokemon = participants.find((pokemon) => {
    return pokemon.id == pokemonId;
  });
  return foundPokemon.pokemonName;
}

function pokemonsTrainerforGen(pokemonId, gen) {
  const trainerLink = gen.trainers.find(
    (trainer) => trainer.participantId == pokemonId,
  );

  if (!trainerLink) {
    return "Unknown";
  }

  const foundTrainer = trainers.find(
    (trainer) => trainer.id == trainerLink.trainerId,
  );

  if (foundTrainer) {
    return foundTrainer.name;
  } else {
    return "Unknown";
  }
}

function gymScoreBoard(participatingPokemons) {
  const tableBody = document.querySelector("#gymStatsScoreBoard table tbody");
  tableBody.innerHTML = "";

  let tableIndex = 1;

  participatingPokemons.forEach((pokemon) => {
    const tableRow = document.createElement("tr");
    tableBody.appendChild(tableRow);

    const tableDataIndex = document.createElement("td");
    tableDataIndex.textContent = tableIndex;
    tableDataIndex.style.paddingLeft = "20px";
    tableIndex++;

    const tableDataPokemon = document.createElement("td");
    tableDataPokemon.textContent = pokemonIdToName(pokemon.id);

    const tableDataTrainer = document.createElement("td");
    tableDataTrainer.textContent = pokemonsTrainerforGen(
      pokemon.id,
      currentGen[0],
    );
    tableDataTrainer.style.textAlign = "left";

    const tableDataScore = document.createElement("td");
    tableDataScore.textContent = pokemon.totalScore;
    tableDataScore.style.paddingRight = "20px";
    tableDataScore.style.textAlign = "right";

    tableRow.append(
      tableDataIndex,
      tableDataPokemon,
      tableDataTrainer,
      tableDataScore,
    );
  });
}

function getScatterData(gym, gen) {
  let pokemonMap = {};

  gen.competitionDays.forEach((day) => {
    day.events.forEach((event) => {
      if (event.disciplineId == gym.id) {
        event.scores.forEach((score) => {
          const pokemonId = score.participantId;

          if (!pokemonMap[pokemonId]) {
            pokemonMap[pokemonId] = {
              id: pokemonId,
              totalScore: 0,
              competitions: 0,
            };
          }

          pokemonMap[pokemonId].totalScore += score.score;
          pokemonMap[pokemonId].competitions += 1;
        });
      }
    });
  });

  return Object.values(pokemonMap);
}

function createScatterPlot(gym, gen) {
  const data = getScatterData(gym, gen);

  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 725 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  d3.select("#scatterPlotSvg").selectAll("*").remove();

  const svg = d3
    .select("#scatterPlotSvg")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([14, d3.max(data, (pokemon) => pokemon.competitions)])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([15000, d3.max(data, (pokemon) => pokemon.totalScore)])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(5));

  svg.append("g").call(d3.axisLeft(yScale).ticks(5));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Competitions");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .text("Total Score");

  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (pokemon) => xScale(pokemon.competitions))
    .attr("cy", (pokemon) => yScale(pokemon.totalScore))
    .attr("r", 6)
    .attr("fill", (pokemon) => {
      const foundPokemon = participants.find((p) => p.id == pokemon.id);
      if (foundPokemon) {
        return foundPokemon.colors[2];
      } else {
        return "#999";
      }
    })

    .attr("opacity", 0.8)
    .append("title")
    .text((pokemon) => {
      const name = pokemonIdToName(pokemon.id);
      return `${name}\nScore: ${pokemon.totalScore}\nCompetitions: ${pokemon.competitions}`;
    });
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
  gymPage.classList.add("hide");
  startPage.classList.remove("hide");
});
