const gymBanner = document.getElementById("gymBanner")

function renderGymPage(gym, gen) {
    document.getElementById("radarChartSvg").innerHTML = "";
    document.getElementById("radarChartSkillDisplay").innerHTML = "";
    console.log("GEN", gen);
    console.log("GYM", gym);
    

    startPage.classList.add("hide");
    gymPage.classList.remove("hide");

    document.querySelector("#gymBannerTitle").textContent = `${gym.gymName} - Generation ${Number(gen.year) + 1}`;
    
    gymBanner.style.backgroundColor = gym.color; 

    createRadarChart(gym);
    createSkillList(gym);
    let pokemonsInGymAndGen = gymScoreCalculateFinalScore(gym, gen);
    gymScoreBoard(pokemonsInGymAndGen)


    //console.log("Competitions:", gen.competitionDays)

    //gymScoreCalculateFinalScore(gym, gen)
}

function renderGymPageGenStats (gen) {
}

/*********  A N V Ä N D A   D E N N A F U N K T I O N       F Ö R     A T T      F Y L L A       T A B E L L E N */

function gymScoreCalculateFinalScore (gym, gen) {
  let participatingPokemons = [];
  gen.competitionDays.forEach((day) => {
    day.events.forEach((discipline) => {
      if(discipline.disciplineId == gym.id){
        discipline.scores.forEach((participant) => {

          const index = participatingPokemons.findIndex((pokemon) =>  {
            return pokemon.id == participant.participantId 
          });

          if (index === -1) {
            participatingPokemons.push({
              id: participant.participantId,
              totalScore: participant.score
            });
          } else {
            participatingPokemons[index].totalScore += participant.score;
          }
        })
      }
    })
  })
  participatingPokemons.sort((a, b) => {
  return b.totalScore - a.totalScore
  })
  console.log("PARTICIPATING POKEMONS:", participatingPokemons);
  return participatingPokemons;
}

function pokemonIdToName(pokemonId) {
  const foundPokemon =  participants.find((pokemon) => {
    return pokemon.id == pokemonId;
  })
  return foundPokemon.pokemonName;
}

function pokemonsTrainerforGen (pokemon, gen) {
  gen.trainers.forEach((trainer) => { 
    //trainers hitta o jämföra participant id & trainerID
  })

  // 
}

function gymScoreBoard (participatingPokemons) {
    // bygger hela scoreboarden
    const tableBody = document.querySelector("#gymStatsScoreBoard table tbody");

    let tableIndex = 1;

    participatingPokemons.forEach((pokemon) => {
      const tableRow = document.createElement("tr");
      tableRow.textContent = tableIndex;
      tableIndex++;
      tableBody.appendChild(tableRow);

      const tableDataPokemon = document.createElement("td");
      tableDataPokemon.textContent = pokemonIdToName(pokemon.id);
      const tableDataTrainer = document.createElement("td");
      tableDataTrainer.textContent = "trainer"
      tableDataTrainer.style.textAlign = "center"
      const tableDataScore = document.createElement("td");
      tableDataScore.textContent = pokemon.totalScore;
      tableDataScore.style.textAlign = "right"
      tableRow.append(tableDataPokemon, tableDataTrainer, tableDataScore);
      
      /* const row = document.createElement("tr"); */

    });
    
    /* document.querySelector("#gymStatsScoreBoard table tbody").innerHTML = `
    <tr>
      <th>1</th>
      <td>1976</td>
      <td>9</td>
      <td>1223</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1976</td>
      <td>6</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1976</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1975</td>
      <td>1</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1976</td>
      <td>13</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1976</td>
      <td>11</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1977</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1974</td>
      <td>17</td>
      <td>1123</td>
    </tr>
    ` */
    //document.getElementById("gymStatsScoreBoard").innerHTML += gymScoreCalculateFinalScore(gym, gen);
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
    gymPage.classList.add("hide");
    startPage.classList.remove("hide");
})