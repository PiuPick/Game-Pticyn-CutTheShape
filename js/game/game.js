document.addEventListener("DOMContentLoaded", checkAuth);

const time_effect = 500;
const tasks_count = 5;
let current_task = 0;
let correct_shape_type;
let correct_shape_color;

function checkAuth() {
    if (!getName()) goToIndex();
    else {
        if (getName() === NAME_ADMIN) menuGame();
        else selectLvl();
    }
}

function menuGame() {
    document.body.innerHTML =
        '<div>' +
        '    <h1>Выберите уровень</h1>' +
        '    <button>Уровень 1</button>' +
        '    <button>Уровень 2</button>' +
        '    <button>Уровень 3</button>' +
        '</div>';

    addExitButton().textContent = 'Главное меню';

    for (let lvl = 0; lvl <= LEVELS; lvl++) {
        const btns = document.querySelectorAll('div button');
        btns[lvl].addEventListener('click', () => {
            setLvl(lvl + 1);
            selectLvl();
        });
    }
}

function selectLvl() {
    switch (getLvl()) {
        case 1: startFirstGame(); break;
        case 2: startSecondGame(); break;
        case 3: startThirdGame(); break;
    }
}

function nextTask() {
    addGameStructure();

    document.getElementById('score').textContent = getScore();
    startTimer(TIME - current_task);

    getBoard().innerHTML = '';
    generateShapes();
    let shapes = Array.from(getBoard().children);

    correct_shape_type = shapes[0].classList[1];
    correct_shape_color = shapes[0].style.getPropertyValue('--color');

    return shapes;
}

function checkDoneTask(shape) {
    const shapeType = shape.classList[1];
    const color = shape.style.getPropertyValue('--color');

    if (shapeType === correct_shape_type && color === correct_shape_color) {
        setScore(getScore() + (current_task + 1)  * getLvl());
        createSparks(shape);
        shape.remove();
        setTimeout(() => stopTimer(), time_effect);
    } else {
        setScore(getScore() - (current_task + 1) * getLvl());
        getBoard().style.boxShadow = 'inset 0 0 100px rgba(255, 0, 0, 0.5)';
        setTimeout(() => getBoard().style.boxShadow = '', time_effect);
    }
}

function addGameStructure() {
    document.body.innerHTML = '';

    addTemplateTag('game-info', 'div',
        `<h2>Уровень ${getLvl()}</h2>` +
        `<p>Имя игрока: ${getName()}</p>` +
        `<p>Очки: <span id="score">${getScore()}</span></p>` +
        `<p>Оставшееся время: <span id="timer"></span> сек</p>`);

    addTemplateTag('game-task', 'div', '<p>Задача: <span id="task"></span></p>');
    addTemplateTag('game-board', 'div', '')
    addExitButton();
}

function updatePlayerRating(score, level) {
    if (getName() === NAME_ADMIN) return;

    const rating = getRating();

    let player = rating.find(p => p.name === getName());

    if (!player) {
        player = {
            name: getName(),
            bestScore: score,
            bestLevel: level
        };
        rating.push(player);
    } else {
        if (score > player.bestScore) player.bestScore = score;
        if (level > player.bestLevel) player.bestLevel = level;
    }

    setRating(rating);
}

function createSparks(shape) {
    // Координаты центра фигуры
    const rect = shape.getBoundingClientRect();
    const boardRect = getBoard().getBoundingClientRect();
    const x = rect.left - boardRect.left + rect.width / 2;
    const y = rect.top - boardRect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';

        // Случайное направление и дальность
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100 + 50;
        const dx = Math.cos(angle) * distance + 'px';
        const dy = Math.sin(angle) * distance + 'px';

        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);

        // Начальная позиция — место клика
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';

        getBoard().appendChild(spark);

        // Убираем элемент после анимации
        setTimeout(() => spark.remove(), time_effect);
    }
}