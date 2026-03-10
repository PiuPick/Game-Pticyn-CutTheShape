/**
 * УРОВЕНЬ 2 — Перетащи нужную фигуру на пилу, и она её разрежет.
 * Событие: mousedown + mousemove (перетаскивание) + mouseup (отпускание на пиле).
 * При попадании на пилу — анимация разрезания (фигура крутится и разлетается).
 */
function startSecondGame() {
    const shapes = nextTask();

    // Пила в центре доски
    addTemplateTag('saw', 'div', '<img src="svg/saw.svg">');

    getTask().innerHTML =
        `Перетащите фигуру ` +
        `<span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_type}</span> ` +
        `цвета <span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_color}</span> на пилу` +
        `<br><small style="font-size:0.7em; opacity:0.8">Найдите нужную фигуру и бросьте её на вращающуюся пилу</small>`;

    shapes.forEach(shape =>
        shape.addEventListener('mousedown', (e) => makeShapeDraggableSecond(e, shape))
    );
}

function makeShapeDraggableSecond(e, shape) {
    e.preventDefault();

    const saw = document.getElementById('saw');
    const rect = shape.getBoundingClientRect();
    const boardRect = getBoard().getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    shape.style.zIndex = '100';
    shape.style.transition = 'none';

    function onMouseMove(e) {
        let left = e.clientX - boardRect.left - offsetX;
        let top  = e.clientY - boardRect.top  - offsetY;
        left = Math.max(0, Math.min(left, getBoard().clientWidth  - shape.offsetWidth));
        top  = Math.max(0, Math.min(top,  getBoard().clientHeight - shape.offsetHeight));
        shape.style.left = left + 'px';
        shape.style.top  = top  + 'px';

        // Подсвечиваем пилу при приближении
        const sawRect = saw.getBoundingClientRect();
        const shapeRect = shape.getBoundingClientRect();
        const near = rectsOverlap(shapeRect, sawRect, 30);
        saw.style.filter = near ? 'drop-shadow(0 0 20px orange)' : '';
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saw.style.filter = '';
        shape.style.zIndex = '';

        const sawRect   = saw.getBoundingClientRect();
        const shapeRect = shape.getBoundingClientRect();

        const centerX = shapeRect.left + shapeRect.width  / 2;
        const centerY = shapeRect.top  + shapeRect.height / 2;
        const isOnSaw =
            centerX > sawRect.left && centerX < sawRect.right &&
            centerY > sawRect.top  && centerY < sawRect.bottom;

        if (isOnSaw) {
            // Проверяем правильность фигуры
            if (shape.dataset.type === correct_shape_type && shape.dataset.color === correct_shape_color) {
                animateSawCut(shape);
                createSparks(shape);
                setTimeout(() => {
                    shape.remove();
                    stopTimer();
                }, 600);
            } else {
                // Неверная фигура — штраф
                checkDoneTask(shape);
            }
        }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

/** Проверяет, что два прямоугольника пересекаются с допуском margin */
function rectsOverlap(r1, r2, margin = 0) {
    return !(r1.right  + margin < r2.left   ||
        r1.left   - margin > r2.right  ||
        r1.bottom + margin < r2.top    ||
        r1.top    - margin > r2.bottom);
}

/** Анимация разрезания пилой: фигура «затягивается» в пилу и разлетается */
function animateSawCut(shape) {
    const board = getBoard();
    const saw = document.getElementById('saw');
    const sawRect = saw.getBoundingClientRect();
    const br = board.getBoundingClientRect();
    const size = parseInt(shape.dataset.size);
    const colorHex = COLOR_MAP[shape.dataset.color] || '#fff';

    // Фигура летит к центру пилы
    const sawCx = sawRect.left - br.left + sawRect.width  / 2;
    const sawCy = sawRect.top  - br.top  + sawRect.height / 2;

    shape.style.transition = 'left 0.2s, top 0.2s';
    shape.style.left = (sawCx - size / 2) + 'px';
    shape.style.top  = (sawCy - size / 2) + 'px';

    setTimeout(() => {
        shape.style.opacity = '0';

        // Создаём осколки
        for (let i = 0; i < 3; i++) {
            const piece = document.createElement('div');
            piece.style.cssText = `
                position:absolute;
                left:${sawCx - size/2}px; top:${sawCy - size/2}px;
                width:${size}px; height:${size}px;
                pointer-events:none; z-index:200; overflow:hidden;
            `;
            piece.innerHTML = buildSVGShape(shape.dataset.type, size, colorHex);
            const clipY1 = Math.round(i * 100 / 3);
            const clipY2 = Math.round((i + 1) * 100 / 3);
            piece.style.clipPath = `polygon(0 ${clipY1}%, 100% ${clipY1}%, 100% ${clipY2}%, 0 ${clipY2}%)`;
            piece.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            board.appendChild(piece);

            const angle = (Math.random() - 0.5) * 180;
            const dx = (Math.random() - 0.5) * 150;
            const dy = (Math.random() - 0.5) * 150;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}deg)`;
                piece.style.opacity = '0';
            }));
            setTimeout(() => piece.remove(), 600);
        }
    }, 200);
}
