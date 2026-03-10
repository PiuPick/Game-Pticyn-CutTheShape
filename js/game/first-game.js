/**
 * УРОВЕНЬ 1 — Проведи линию через нужную фигуру.
 * Событие: зажать кнопку мыши и провести линию (mousemove + mousedown + mouseup).
 * Линия рисуется на canvas поверх доски.
 * Если линия пересекает правильную фигуру — разрез засчитывается.
 */
function startFirstGame() {
    const shapes = nextTask();
    initCustomCursor();

    getTask().innerHTML =
        `Проведите линию-разрез через фигуру ` +
        `<span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_type}</span> ` +
        `цвета <span style="color:${COLOR_MAP[correct_shape_color] || correct_shape_color}; font-weight:bold; text-shadow:0 0 6px #000">${correct_shape_color}</span>` +
        `<br><small style="font-size:0.7em; opacity:0.8">Зажмите кнопку мыши и проведите линию через фигуру</small>`;

    // Создаём canvas для рисования линии
    const canvas = document.createElement('canvas');
    canvas.id = 'cut-canvas';
    canvas.width = getBoard().clientWidth;
    canvas.height = getBoard().clientHeight;
    getBoard().appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let drawing = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    getBoard().addEventListener('mousedown', onMouseDown);

    function onMouseDown(e) {
        drawing = true;
        const rect = getBoard().getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        currentX = startX;
        currentY = startY;

        getBoard().addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        if (!drawing) return;
        const rect = getBoard().getBoundingClientRect();
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;

        // Рисуем линию в реальном времени
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = 'rgba(255, 230, 50, 0.9)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 6]);
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 8;
        ctx.stroke();
    }

    function onMouseUp() {
        if (!drawing) return;
        drawing = false;
        getBoard().removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Очищаем линию
        setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 300);

        // Проверяем пересечение линии с каждой фигурой
        const cutShape = findShapeCutByLine(shapes, startX, startY, currentX, currentY);

        if (cutShape) {
            const isCorrect =
                cutShape.dataset.type === correct_shape_type &&
                cutShape.dataset.color === correct_shape_color;

            if (isCorrect) {
                animateCut(cutShape);
                createSparks(cutShape);
                setTimeout(() => {
                    cutShape.remove();
                    canvas.remove();
                    stopTimer();
                }, 500);
            } else {
                // Штраф — неверная фигура
                checkDoneTask(cutShape); // передаём неправильную фигуру → штраф
            }
        }
    }
}

/**
 * Проверяет, пересекает ли линия (x1,y1)→(x2,y2) хотя бы одну из фигур.
 * Возвращает первую попавшуюся фигуру или null.
 */
function findShapeCutByLine(shapes, x1, y1, x2, y2) {
    for (const shape of shapes) {
        if (!shape.isConnected) continue;
        const r = shape.getBoundingClientRect();
        const br = getBoard().getBoundingClientRect();
        const sl = r.left - br.left;
        const st = r.top - br.top;
        const sr = sl + r.width;
        const sb = st + r.height;
        const cx = sl + r.width / 2;
        const cy = st + r.height / 2;
        const radius = Math.min(r.width, r.height) / 2;

        if (lineIntersectsRect(x1, y1, x2, y2, sl, st, sr, sb)) {
            return shape;
        }
    }
    return null;
}

/** Проверяет пересечение отрезка с прямоугольником */
function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rx2, ry2) {
    // Точка внутри прямоугольника
    if (x1 >= rx && x1 <= rx2 && y1 >= ry && y1 <= ry2) return true;
    if (x2 >= rx && x2 <= rx2 && y2 >= ry && y2 <= ry2) return true;
    // Проверяем пересечение с 4 сторонами
    return (
        segmentsIntersect(x1,y1,x2,y2, rx,ry,rx2,ry) ||
        segmentsIntersect(x1,y1,x2,y2, rx2,ry,rx2,ry2) ||
        segmentsIntersect(x1,y1,x2,y2, rx,ry2,rx2,ry2) ||
        segmentsIntersect(x1,y1,x2,y2, rx,ry,rx,ry2)
    );
}

function segmentsIntersect(p1x,p1y,p2x,p2y, p3x,p3y,p4x,p4y) {
    const d1x = p2x-p1x, d1y = p2y-p1y;
    const d2x = p4x-p3x, d2y = p4y-p3y;
    const cross = d1x*d2y - d1y*d2x;
    if (Math.abs(cross) < 1e-8) return false;
    const dx = p3x-p1x, dy = p3y-p1y;
    const t = (dx*d2y - dy*d2x) / cross;
    const u = (dx*d1y - dy*d1x) / cross;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/** Визуальный эффект разрезания: фигура разлетается на 2 части */
function animateCut(shape) {
    const board = getBoard();
    const rect = shape.getBoundingClientRect();
    const br = board.getBoundingClientRect();
    const l = rect.left - br.left;
    const t = rect.top - br.top;
    const w = rect.width;
    const h = rect.height;
    const size = parseInt(shape.dataset.size);
    const colorHex = COLOR_MAP[shape.dataset.color] || '#fff';

    // Создаём две половинки через clip-path
    ['top', 'bottom'].forEach((half, i) => {
        const clone = document.createElement('div');
        clone.style.cssText = `
            position:absolute;
            left:${l}px; top:${t}px;
            width:${w}px; height:${h}px;
            pointer-events:none;
            z-index:200;
            overflow:hidden;
        `;
        clone.innerHTML = buildSVGShape(shape.dataset.type, size, colorHex);
        // Обрезаем половину через clip
        clone.style.clipPath = i === 0
            ? `polygon(0 0, 100% 0, 100% 50%, 0 50%)`
            : `polygon(0 50%, 100% 50%, 100% 100%, 0 100%)`;

        const dir = i === 0 ? -1 : 1;
        clone.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        board.appendChild(clone);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                clone.style.transform = `translateY(${dir * 80}px) rotate(${dir * 20}deg)`;
                clone.style.opacity = '0';
            });
        });
        setTimeout(() => clone.remove(), 550);
    });

    shape.style.opacity = '0';
}
