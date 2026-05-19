function renderGymPage(gym) {
    console.log(gym);
    startPage.classList.add("hide");
    gymPage.classList.remove("hide");
    document.querySelector("#gymBannerTitle").textContent = gym.gymName;

    createRadarChart(gym);
}

document.querySelector("#gymBannerBack").addEventListener("click", function () {
    gymPage.classList.add("hide");
    startPage.classList.remove("hide");
})