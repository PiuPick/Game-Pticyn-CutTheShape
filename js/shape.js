// Названия фигур и цветов на русском языке
const SHAPES = ['круг', 'треугольник', 'квадрат', 'пятиугольник', 'шестиугольник'];
const COLORS = ['жёлтый', 'красный', 'синий', 'зелёный', 'белый'];

// Соответствие русского названия → CSS-цвет
const COLOR_MAP = {
    'жёлтый': '#f0e040',
    'красный': '#e03030',
    'синий':   '#3060e0',
    'зелёный': '#30b030',
    'белый':   '#f0f0f0'
};

let existingShapes = [];

/**
 * Строит SVG-полигон для нужной фигуры.
 * Возвращает строку с SVG-разметкой внутри <svg>.
 */
function buildSVGShape(type, size, colorHex) {
    const s = size;
    const h = s / 2;

    let points = '';
    switch (type) {
        case 'круг':
            return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="${h}" cy="${h}" r="${h - 2}" fill="${colorHex}" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
                    </svg>`;
        case 'треугольник':
            points = `${h},2 ${s - 2},${s - 2} 2,${s - 2}`;
            break;
        case 'квадрат':
            points = `2,2 ${s - 2},2 ${s - 2},${s - 2} 2,${s - 2}`;
            break;
        case 'пятиугольник': {
            const cx = h, cy = h, r = h - 2;
            const pts = [];
            for (let i = 0; i < 5; i++) {
                const a = (Math.PI * 2 * i / 5) - Math.PI / 2;
                pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
            }
            points = pts.join(' ');
            break;
        }
        case 'шестиугольник': {
            const cx = h, cy = h, r = h - 2;
            const pts = [];
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI * 2 * i / 6);
                pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
            }
            points = pts.join(' ');
            break;
        }
    }
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
              <polygon points="${points}" fill="${colorHex}" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
            </svg>`;
}

function createRandomShape() {
    const shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const colorName = COLORS[Math.floor(Math.random() * COLORS.length)];
    const colorHex = COLOR_MAP[colorName];
    const size = Math.floor(Math.random() * 70) + 50; // 50-120 px
    const rotation = Math.floor(Math.random() * 360);

    const board = getBoard();

    let left, top, attempts = 0;
    do {
        left = Math.random() * (board.clientWidth - size);
        top = Math.random() * (board.clientHeight - size);
        attempts++;
        if (attempts > 100) break;
    } while (isOverlapping(left, top, size));

    const div = document.createElement('div');
    div.className = 'shape';
    // Данные фигуры — в data-атрибутах (русские названия)
    div.dataset.type = shapeType;
    div.dataset.color = colorName;
    div.dataset.size = size;

    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.top = top + 'px';
    div.style.left = left + 'px';
    div.style.setProperty('--rotation', `${rotation}deg`);
    div.style.transform = `rotate(${rotation}deg)`;
    div.innerHTML = buildSVGShape(shapeType, size, colorHex);

    existingShapes.push({ left, top, size });
    return div;
}

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

function generateShapes(count = 8) {
    existingShapes = [];
    for (let i = 0; i < count; i++) {
        getBoard().appendChild(createRandomShape());
    }
}
