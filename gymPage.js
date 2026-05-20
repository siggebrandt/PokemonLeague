const gymBanner = document.getElementById("gymBanner")

function renderGymPage(gym, gen) {
    document.getElementById("radarChartSvg").innerHTML = "";
    console.log(gen);
    console.log(gym);
    

    startPage.classList.add("hide");
    gymPage.classList.remove("hide");

    if (gen.length == 1) {
      document.querySelector("#gymBannerTitle").textContent = `${gym.gymName} - Generation ${Number(gen.year) + 1}`;
    } else {
      document.querySelector("#gymBannerTitle").textContent = `${gym.gymName} - All Generations`;
    }

    gymBanner.style.backgroundColor = gym.color; 

    createRadarChart(gym);
    gymScoreBoard(gym, gen)
    //console.log("Competitions:", gen.competitionDays)

    gymScoreCalculateFinalScore(gym, gen)
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
  console.log(participatingPokemons);
  return participatingPokemons;
}

function gymScoreBoard (gym, gen) {
  console.log(gen)
    // bygger hela scoreboarden

    //gen.sort(function(a, b){return b - a})
    
    document.getElementById("gymStatsScoreBoard").innerHTML = `
    <table>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">pokemon</th>
      <th scope="col">trainer</th>
      <th scope="col">final score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>1976</td>
      <td>9</td>
      <td>1223</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>1976</td>
      <td>6</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>1976</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>1975</td>
      <td>1</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>1976</td>
      <td>13</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">6</th>
      <td>1976</td>
      <td>11</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">7</th>
      <td>1977</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">8</th>
      <td>1974</td>
      <td>17</td>
      <td>1123</td>
    </tr>
  </tbody>
</table>
    `

    document.getElementById("gymStatsScoreBoard").innerHTML += gymScoreCalculateFinalScore(gym, gen);
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
    gymPage.classList.add("hide");
    startPage.classList.remove("hide");
})