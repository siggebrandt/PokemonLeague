const gymBanner = document.getElementById("gymBanner")

function renderGymPage(gym, gen) {
    document.getElementById("radarChartSvg").innerHTML = "";
    console.log(gym);
    console.log(gen);

    startPage.classList.add("hide");
    gymPage.classList.remove("hide");

    document.querySelector("#gymBannerTitle").textContent = `${gym.gymName} - Gen ${gen}`;

    gymBanner.style.backgroundColor = gym.color; 

    createRadarChart(gym);
    gymScoreBoard(gym)
}

function gymScoreBoard () {
    // bygger hela scoreboarden
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
      <th scope="row">Buzzcocks</th>
      <td>1976</td>
      <td>9</td>
      <td>1223</td>
    </tr>
    <tr>
      <th scope="row">The Clash</th>
      <td>1976</td>
      <td>6</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">The Damned</th>
      <td>1976</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">Sex Pistols</th>
      <td>1975</td>
      <td>1</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">Sham 69</th>
      <td>1976</td>
      <td>13</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">Siouxsie and the Banshees</th>
      <td>1976</td>
      <td>11</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">Stiff Little Fingers</th>
      <td>1977</td>
      <td>10</td>
      <td>1123</td>
    </tr>
    <tr>
      <th scope="row">The Stranglers</th>
      <td>1974</td>
      <td>17</td>
      <td>1123</td>
    </tr>
  </tbody>
</table>
    `
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
    gymPage.classList.add("hide");
    startPage.classList.remove("hide");
})