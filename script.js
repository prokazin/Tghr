const tg = window.Telegram.WebApp;
tg.expand(); // разворачивает WebApp

let galleons = 0;
let multiplier = 1;

const counter = document.getElementById("counter");
const wand = document.getElementById("wand");
const upgradeBtn = document.getElementById("upgrade");

const modal = document.getElementById("upgrade-modal");
const openBtn = document.getElementById("open-upgrades");
const closeBtn = document.getElementById("close-upgrades");

async function loadProgress() {
  try {
    const data = await tg.CloudStorage.getItem('clicker-data');
    if (data) {
      const parsed = JSON.parse(data);
      galleons = parsed.galleons || 0;
      multiplier = parsed.multiplier || 1;
    }
  } catch (e) {
    console.warn('Ошибка загрузки:', e);
  }
  updateCounter();
}

function saveProgress() {
  const data = JSON.stringify({ galleons, multiplier });
  tg.CloudStorage.setItem('clicker-data', data).catch(console.warn);
}

function updateCounter() {
  counter.textContent = `Галлеоны: ${galleons}`;
  saveProgress();
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
    alert("Улучшено! Сила клика увеличена.");
  } else {
    alert("Недостаточно галлеонов.");
  }
});

// Открытие/закрытие модального окна
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// Поддержка двойного тапа (зум на мобильных)
let lastTap = 0;
wand.addEventListener("touchend", (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  if (tapLength < 500 && tapLength > 0) {
    if (wand.style.transform === "scale(2)") {
      wand.style.transform = "scale(1)";
    } else {
      wand.style.transform = "scale(2)";
    }
  }
  lastTap = currentTime;
});

// Загружаем прогресс при старте
loadProgress();
