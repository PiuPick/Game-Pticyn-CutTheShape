let timerInterval;

function startTimer(time) {
    clearInterval(timerInterval);
    let timeLeft = time;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timerElement.textContent = --timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    ++current_task;
    clearInterval(timerInterval);
    updatePlayerRating(getScore(), getLvl());

    if (current_task === tasks_count) {
        let nextLvl = getLvl() + 1;
        current_task = 0;

        if (nextLvl > LEVELS)
            goToRating();
        else {
            setLvl(nextLvl);
            selectLvl();
        }
    }
    else selectLvl();
}