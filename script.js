let galleons = parseInt(localStorage.getItem("galleons")) || 0;
let multiplier = parseInt(localStorage.getItem("multiplier")) || 1;

const counter = document.getElementById("counter");
const wand = document.getElementById("wand");
const upgradeBtn = document.getElementById("upgrade");

function updateCounter() {
  counter.textContent = `Галлеоны: ${galleons}`;
  localStorage.setItem("galleons", galleons);
  localStorage.setItem("multiplier", multiplier);
}

wand.addEventListener("click", () => {
  galleons += multiplier;
  updateCounter();
});

upgradeBtn.addEventListener("click", () => {
  if (galleons >= 100) {
    galleons -= 100;
    multiplier++;
    updateCounter();
    alert("Вы улучшили палочку! Теперь кликов больше.");
  } else {
    alert("Недостаточно галлеонов!");
  }
});

updateCounter();
