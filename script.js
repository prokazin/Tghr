// Инициализация Telegram WebApp
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// Прогресс игрока
let galleons = 0;
let multiplier = 1;

// DOM-элементы
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

const toast = document.getElementById("toast");

// Демонстрационные данные лидеров
const leaderboardData = [
  { name: "Гарри", score: 1200 },
  { name: "Гермиона", score: 900 },
  { name: "Рон", score: 700 },
];

// Функция показа всплывающего уведомления
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Обновление класса палочки по уровню
function updateWandLevelClass() {
  wand.classList.remove(
    "wand-level-1",
    "wand-level-2",
    "wand-level-3",
    "wand-level-4",
    "wand-level-5"
  );
  const level = Math.min(multiplier, 5);
  wand.classList.add(`wand-level-${level}`);
}

// Загрузка прогресса игрока
function loadProgress() {
  if (!tg) {
    galleons = parseInt(localStorage.getItem("galleons")) || 0;
    multiplier = parseInt(localStorage.getItem("multiplier")) || 1;
    updateCounter();
    return;
  }

  tg.CloudStorage.getItem("clicker-data", (error, value) => {
    if (error) {
      console.warn("Ошибка загрузки:", error);
    } else if (value) {
      try {
        const parsed = JSON.parse(value);
        galleons = parsed.galleons || 0;
        multiplier = parsed.multiplier || 1;
      } catch (e) {
        console.warn("Ошибка разбора:", e);
      }
    }
    updateCounter();
  });
}

// Сохранение прогресса
function saveProgress() {
  const data = JSON.stringify({ galleons, multiplier });

  if (!tg) {
    localStorage.setItem("galleons", galleons);
    localStorage.setItem("multiplier", multiplier);
    return;
  }

  tg.CloudStorage.setItem("clicker-data", data, (error) => {
    if (error) {
      console.warn("Ошибка сохранения:", error);
    }
  });
}

// Обновление счётчика
function updateCounter() {
  counter.textContent = `Галлеоны: ${galleons}`;
  saveProgress();
  updateWandLevelClass();
}

// Клик по палочке
wand.addEventListener("click", () => {
  galleons += multiplier;
  updateCounter();
});

// Эффект нажатия на палочку
wand.addEventListener("mousedown", () => {
  wand.classList.add("pressed");
});
wand.addEventListener("mouseup", () => {
  wand.classList.remove("pressed");
});
wand.addEventListener("mouseleave", () => {
  wand.classList.remove("pressed");
});
wand.addEventListener("touchstart", () => {
  wand.classList.add("pressed");
});
wand.addEventListener("touchend", () => {
  wand.classList.remove("pressed");
});

// Улучшение
upgradeBtn.addEventListener("click", () => {
  if (galleons >= 100) {
    galleons -= 100;
    multiplier++;
    updateCounter();
    showToast("Улучшено! Сила клика увеличена.");
  } else {
    showToast("Недостаточно галлеонов.");
  }
});

// Окно улучшений
openBtn.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");

// Окно лидеров
openLeaderboardBtn.onclick = () => {
  renderLeaderboard();
  leaderboardModal.style.display = "block";
};
closeLeaderboardBtn.onclick = () => {
  leaderboardModal.style.display = "none";
};

// Закрытие по фону
window.onclick = (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === leaderboardModal) leaderboardModal.style.display = "none";
};

// Рендер лидеров
function renderLeaderboard() {
  leaderboardList.innerHTML = "";
  const player = { name: "Вы", score: galleons };
  const fullList = [...leaderboardData, player];
  fullList.sort((a, b) => b.score - a.score);
  fullList.slice(0, 10).forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${entry.name}: ${entry.score} галлеонов`;
    leaderboardList.appendChild(li);
  });
}

// Загружаем прогресс при старте
loadProgress();
