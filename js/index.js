document.addEventListener("DOMContentLoaded", menu);

function menu() {
    createMenu();

    const input = document.querySelector(`#main input`);
    const startBtn = document.getElementById('start');
    const ratingBtn = document.getElementById('rating');

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") start(input.value);
    });
    startBtn.addEventListener("click", () => start(input.value));
    ratingBtn.addEventListener("click", goToRating);
}

function createMenu() {
    addTemplateTag('main', 'div',
        `<h1>Игра «Разрежь фигуру»</h1>` +
        `<input placeholder="Введите имя" type="text">` +
        `<button id="start">Начать игру</button>` +
        `<button id="rating">Рейтинг</button>`)
}

function start(name) {
    const trimName = name.trim();
    if (!trimName) {
        alert('Введите имя!');
        return;
    }

    setName(trimName);

    const playerData = JSON.parse(localStorage.getItem(trimName)) || {}; // Получаем данные игрока из localStorage, если они есть
    setScore(playerData.bestScore || 0); // Устанавливаем лучший результат игрока, если он есть

    if (getName() === NAME_ADMIN) setLvl(0);
    else setLvl(1);

    goToGame();
}
