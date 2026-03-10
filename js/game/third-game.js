/**
 * УРОВЕНЬ 3 — Фигуры движутся. Наведи курсор (hover) и зажми клавишу первой буквы
 * названия фигуры, потом кликни — разрезание!
 * Событие: mouseover (подсветка) + keydown + click.
 * Скорость движения выше, чем на предыдущих уровнях.
 */

let thirdGameInterval = null;

function startThirdGame() {
    // Очищаем предыдущий интервал, если остался
    if (thirdGameInterval) { clearInterval(thirdGameInterval); thirdGameInterval = null; }

    const shapes = nextTask();
    initCustomCursor();

    let activeKey = null;
    document.addEventListener('keydown', (e) => activeKey = e.key.toLowerCase());
    document.addEventListener('keyup',   ()  => activeKey = null);

    // Первая буква русского названия → нужная клавиша
    // к=к, т=т, ш=w, п=п, ч — используем транслитерацию только для показа
    const firstLetter = correct_shape_type[0]; // русская буква для отображения

    getTask().innerHTML =
        `Наведите курсор на фигуру ` +
        `<span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_type}</span> ` +
        `цвета <span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_color}</span>` +
        `<br>Зажмите клавишу <kbd style="background:#333;padding:2px 8px;border-radius:4px;font-size:0.8em">${firstLetter}</kbd> и кликните по ней!` +
        `<br><small style="font-size:0.65em; opacity:0.8">Фигуры движутся — будьте быстрее!</small>`;

    // Назначаем обработчики кликов
    shapes.forEach(shape => {
        shape.addEventListener('click', () => {
            if (activeKey === firstLetter) {
                if (shape.dataset.type === correct_shape_type && shape.dataset.color === correct_shape_color) {
                    clearInterval(thirdGameInterval);
                    thirdGameInterval = null;
                    animateCut(shape);
                    createSparks(shape);
                    setTimeout(() => {
                        shape.remove();
                        stopTimer();
                    }, 500);
                } else {
                    checkDoneTask(shape); // штраф
                }
            } else {
                // Нажата не та клавиша — небольшое предупреждение
                shape.style.filter = 'drop-shadow(0 0 12px red)';
                setTimeout(() => shape.style.filter = '', 300);
            }
        });

        // Подсветка при наведении мыши
        shape.addEventListener('mouseenter', () => {
            shape.style.filter = 'drop-shadow(0 0 18px gold)';
            shape.style.zIndex = '20';
        });
        shape.addEventListener('mouseleave', () => {
            shape.style.filter = '';
            shape.style.zIndex = '';
        });
    });

    // Движение фигур каждые 80 мс (быстрее, чем раньше)
    const speed = 12;
    // Даём каждой фигуре случайный вектор скорости
    shapes.forEach(shape => {
        shape._vx = (Math.random() - 0.5) * speed;
        shape._vy = (Math.random() - 0.5) * speed;
    });

    thirdGameInterval = setInterval(() => {
        const boardW = getBoard().clientWidth;
        const boardH = getBoard().clientHeight;
        shapes.forEach(shape => {
            if (!shape.isConnected) return;
            const size = parseInt(shape.dataset.size);
            let left = parseFloat(shape.style.left) + shape._vx;
            let top  = parseFloat(shape.style.top)  + shape._vy;

            // Отражаем от стенок
            if (left < 0)          { left = 0;          shape._vx *= -1; }
            if (left > boardW - size) { left = boardW - size; shape._vx *= -1; }
            if (top  < 0)          { top  = 0;          shape._vy *= -1; }
            if (top  > boardH - size) { top  = boardH - size; shape._vy *= -1; }

            shape.style.left = left + 'px';
            shape.style.top  = top  + 'px';
        });
    }, 80);
}
