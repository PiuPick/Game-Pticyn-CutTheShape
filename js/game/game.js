document.addEventListener("DOMContentLoaded", checkAuth);

const time_effect = 500;
const tasks_count = 5;
let current_task = 0;
let correct_shape_type;   // русское название фигуры
let correct_shape_color;  // русское название цвета

function checkAuth() {
    if (!getName()) goToIndex();
    else {
        if (getName() === NAME_ADMIN) menuGame();
        else selectLvl();
    }
}

/** Меню выбора уровня — только для администратора */
function menuGame() {
    document.body.innerHTML = '';
    addTemplateTag('level-menu', 'div',
        `<h1>Выберите уровень</h1>
         <button id="lvl1">Уровень 1 — Разрежь линией</button>
         <button id="lvl2">Уровень 2 — Брось на пилу</button>
         <button id="lvl3">Уровень 3 — Поймай и разрежь</button>`);

    addExitButton().textContent = 'Главное меню';

    document.getElementById('lvl1').addEventListener('click', () => { setLvl(1); selectLvl(); });
    document.getElementById('lvl2').addEventListener('click', () => { setLvl(2); selectLvl(); });
    document.getElementById('lvl3').addEventListener('click', () => { setLvl(3); selectLvl(); });
}

function selectLvl() {
    switch (getLvl()) {
        case 1: startFirstGame();  break;
        case 2: startSecondGame(); break;
        case 3: startThirdGame();  break;
    }
}

/**
 * Подготавливает следующее задание:
 * - строит игровую структуру
 * - генерирует фигуры
 * - определяет правильную фигуру (первая в списке)
 */
function nextTask() {
    addGameStructure();

    document.getElementById('score').textContent = getScore();
    startTimer(TIME - current_task); // каждое задание чуть быстрее

    getBoard().innerHTML = '';
    generateShapes();
    const shapes = Array.from(getBoard().children);

    // Правильная фигура — первая (случайная, т.к. generateShapes случайна)
    correct_shape_type  = shapes[0].dataset.type;
    correct_shape_color = shapes[0].dataset.color;

    return shapes;
}

/**
 * Проверяет результат выбора фигуры.
 * Используется для штрафов (неверная фигура).
 */
function checkDoneTask(shape) {
    const shapeType  = shape.dataset.type;
    const shapeColor = shape.dataset.color;

    if (shapeType === correct_shape_type && shapeColor === correct_shape_color) {
        // Верная фигура — засчитать (на случай если вызвана напрямую)
        setScore(getScore() + (current_task + 1) * getLvl());
        createSparks(shape);
        animateCut(shape);
        setTimeout(() => { shape.remove(); stopTimer(); }, time_effect);
    } else {
        // Штраф за неверный выбор
        const penalty = (current_task + 1) * getLvl();
        setScore(getScore() - penalty);
        document.getElementById('score').textContent = getScore();

        // Визуальный сигнал — красная вспышка доски
        getBoard().style.boxShadow = 'inset 0 0 100px rgba(255, 0, 0, 0.7)';
        shape.style.filter = 'drop-shadow(0 0 20px red)';
        setTimeout(() => {
            getBoard().style.boxShadow = '';
            shape.style.filter = '';
        }, time_effect);
    }
}

function addGameStructure() {
    document.body.innerHTML = '';

    const lvlNames = { 1: 'Уровень 1 — Разрежь линией', 2: 'Уровень 2 — Брось на пилу', 3: 'Уровень 3 — Поймай и разрежь' };

    addTemplateTag('game-info', 'div',
        `<h2>${lvlNames[getLvl()] || 'Уровень ' + getLvl()}</h2>` +
        `<p>Игрок: <b>${getName()}</b></p>` +
        `<p>Очки: <span id="score">${getScore()}</span></p>` +
        `<p>Время: <span id="timer"></span> сек</p>`);

    addTemplateTag('game-task', 'div', '<p>Задача: <span id="task"></span></p>');
    addTemplateTag('game-board', 'div', '');
    addExitButton();
}

function updatePlayerRating(score, level) {
    if (getName() === NAME_ADMIN) return;
    const rating = getRating();
    let player = rating.find(p => p.name === getName());
    if (!player) {
        player = { name: getName(), bestScore: score, bestLevel: level };
        rating.push(player);
    } else {
        if (score > player.bestScore) player.bestScore = score;
        if (level > player.bestLevel) player.bestLevel = level;
    }
    setRating(rating);
}

/** Искры при правильном разрезании */
function createSparks(shape) {
    const rect = shape.getBoundingClientRect();
    const boardRect = getBoard().getBoundingClientRect();
    const x = rect.left - boardRect.left + rect.width  / 2;
    const y = rect.top  - boardRect.top  + rect.height / 2;

    for (let i = 0; i < 24; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const angle    = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 120 + 40;
        spark.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
        spark.style.left = x + 'px';
        spark.style.top  = y + 'px';
        getBoard().appendChild(spark);
        setTimeout(() => spark.remove(), time_effect);
    }
}
