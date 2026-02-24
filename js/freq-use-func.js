const NAME_ADMIN = 'admin'
const LEVELS = 3;
const TIME = 10;

function addTemplateTag(id, tag, html) {
    const tempTag = document.createElement(tag);
    tempTag.id = id;
    tempTag.innerHTML = html;
    document.body.append(tempTag);
    return tempTag;
}

function addExitButton() {
    const exitBtn = addTemplateTag('exit', 'button', 'Выйти из игры');

    exitBtn.addEventListener('click', () => {
        if (getName() === NAME_ADMIN && getLvl() !== 0) {
            goToGame();
            setLvl(0);
        } else goToIndex();
    });

    return exitBtn;
}

function goToIndex() {
    window.location.href = "index.html";
}

function goToGame() {
    window.location.href = "game.html";
}

function goToRating() {
    window.location.href = "rating.html";
}

function getName() {
    return localStorage.getItem('name');
}

function setName(name) {
    localStorage.setItem('name', name);
}

function getScore() {
    return parseInt(localStorage.getItem('score'));
}

function setScore(score) {
    localStorage.setItem('score', score);
}

function getLvl() {
    return parseInt(localStorage.getItem('lvl'));
}

function setLvl(lvl) {
    localStorage.setItem('lvl', lvl);
}

function getRating() {
    return JSON.parse(localStorage.getItem('rating')) || [];
}

function setRating(rating) {
    localStorage.setItem('rating', JSON.stringify(rating));
}

function getBoard() {
    return document.getElementById('game-board');
}

function getTask() {
    return document.getElementById('task');
}