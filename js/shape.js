const SHAPES = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
const COLORS = ['yellow', 'red', 'blue', 'green', 'white'];

let existingShapes = []; // Сохраняем позиции уже созданных фигур

function createRandomShape() {
    const shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = Math.floor(Math.random() * 70) + 30; // 30-100 px
    const rotation = Math.floor(Math.random() * 360);

    const board = document.getElementById('game-board');

    let left, top, attempts = 0;
    do {
        left = Math.random() * (board.clientWidth - size);
        top = Math.random() * (board.clientHeight - size);
        attempts++;
        if (attempts > 100) break; // Ограничение на бесконечный цикл
    } while (isOverlapping(left, top, size));

    const div = document.createElement('div');
    div.className = `shape ${shapeType}`;
    div.style.setProperty('--color', color);
    div.style.setProperty('--size', size + 'px');
    div.style.top = top + 'px';
    div.style.left = left + 'px';
    div.style.setProperty('--rotation', `${rotation}deg`);

    // Добавляем в массив существующих фигур
    existingShapes.push({left, top, size});

    return div;
}

// Проверка пересечения с существующими фигурами
function isOverlapping(x, y, size) {
    for (const shape of existingShapes) {
        const dx = x - shape.left;
        const dy = y - shape.top;
        if (Math.abs(dx) < size + shape.size && Math.abs(dy) < size + shape.size) {
            return true;
        }
    }
    return false;
}

function generateShapes(count = 10) {
    existingShapes = [];
    for (let i = 0; i < count; i++) {
        getBoard().appendChild(createRandomShape());
    }
}