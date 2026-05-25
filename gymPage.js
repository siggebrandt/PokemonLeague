const gymBanner = document.getElementById("gymBanner")


/**
 * 
 * Ens placering i ligan är baserad på hur många poäng man har tagit under hela
säsongen. Vid varje tävling (event) delas poäng ut enligt:
1:a plats i eventet ger 15 poäng
2:a plats i eventet ger 10 poäng
3:e plats i eventet ger 6 poäng
4:e plats i eventet ger 3 poäng
5:e plats i eventet ger 1 poäng
Deltagaren med högst antal poäng (alla grenar) i slutet av säsongen vinner ligan
Det finns också ett särskilt pris för varje gren

 */

function renderGymPageGenStats (gen) {
  if (!currentGym || !gen) return;
    console.log("CHOSEN", gen)
    console.log("currentGYM", currentGym)
    document.querySelector("#gymBannerTitle").textContent = `${currentGym.gymName} - Generation ${Number(gen.year) + 1}`;
  } ;


function renderGymPage(gym, gen) {
    currentGym = gym;
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
      tableDataTrainer.textContent = "trainer" // trainerIdToName
      tableDataTrainer.style.textAlign = "center"
      const tableDataScore = document.createElement("td");
      tableDataScore.textContent = pokemon.totalScore;
      tableDataScore.style.textAlign = "right"
      tableRow.append(tableDataPokemon, tableDataTrainer, tableDataScore);
    });
    
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
    gymPage.classList.add("hide");
    startPage.classList.remove("hide");
})