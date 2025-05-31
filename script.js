// Telegram WebApp API (если есть)
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// Инициализация переменных прогресса
let galleons = 0;
let multiplier = 1;

// Элементы DOM
const counter = document.getElementById("counter");
const wand = document.getElementById("wand");
const upgradeBtn = document.getElementById("upgrade");

const modal = document.getElementById("upgrade-modal");
const openBtn = document.getElementById("open-upgrades");
const closeBtn = document.getElementById("close-upgrades");

const leaderboardModal = document.getElementById("leaderboard-modal");
const openLeaderboardBtn = document.getElementById("open-leaderboard");
const closeLeaderboardBtn = document.getElementById("close-leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");

// Предустановленные игроки в таблице лидеров
const leaderboardData = [
  { name: "Гарри", score: 1200 },
  { name: "Гермиона", score: 900 },
  { name: "Рон", score: 700 },
];

// Функция загрузки прогресса
async function loadProgress() {
  if (!tg) {
    // fallback — локальное хранилище
    galleons = parseInt(localStorage.getItem("galleons")) || 0;
    multiplier = parseInt(localStorage.getItem("multiplier")) || 1;
    updateCounter();
    return;
  }
  try {
    const data = await tg.CloudStorage.getItem("clicker-data");
    if (data) {
      const parsed = JSON.parse(data);
      galleons = parsed.galleons || 0;
      multiplier = parsed.multiplier || 1;
    }
  } catch (e) {
    console.warn("Ошибка загрузки:", e);
  }
  updateCounter();
}

// Функция сохранения прогресса
function saveProgress() {
  if (!tg) {
    localStorage.setItem("galleons", galleons);
    localStorage.setItem("multiplier", multiplier);
    return;
  }
  const data = JSON.stringify({ galleons, multiplier });
  tg.CloudStorage.setItem("clicker-data", data).catch(console.warn);
}

// Обновление счетчика на экране
function updateCounter() {
  counter.textContent = `Галлеоны: ${galleons}`;
  saveProgress();
}

// Обработчик клика по палочке — прибавляем галлеоны
wand.addEventListener("click", () => {
  galleons += multiplier;
  updateCounter();
});

// Покупка улучшения
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

// Открытие/закрытие модального окна улучшений
openBtn.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");

// Открытие/закрытие модального окна таблицы лидеров
openLeaderboardBtn.onclick = () => {
  renderLeaderboard();
  leaderboardModal.style.display = "block";
};
closeLeaderboardBtn.onclick = () => {
  leaderboardModal.style.display = "none";
};

// Закрытие модальных окон по клику вне окна
window.onclick = (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === leaderboardModal) leaderboardModal.style.display = "none";
};

// Рендер таблицы лидеров
function renderLeaderboard() {
  leaderboardList.innerHTML = "";
  // Добавляем игрока в общий список и сортируем
  const playerEntry = { name: "Вы", score: galleons };
  const combined = [...leaderboardData, playerEntry];
  combined.sort((a, b) => b.score - a.score);

  combined.slice(0, 10).forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name}: ${entry.score} галлеонов`;
    leaderboardList.appendChild(li);
  });
}

// Поддержка приближения палочки по двойному тапу (для мобильных)
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

// Загрузка прогресса при старте
loadProgress();
