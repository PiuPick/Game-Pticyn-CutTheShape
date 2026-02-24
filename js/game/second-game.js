function startSecondGame() {
    let shapes = nextTask();

    addTemplateTag('saw', 'div', '<img src="../svg/saw.svg">');

    getTask().innerHTML = `Перетащите фигуру 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_type}</span> цвета 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_color}</span> на пилу`;

    shapes.forEach(shape =>
        shape.addEventListener('mousedown', // Начинаем перетаскивание при нажатии на мышь
            (e) => makeShapeDraggableSecond(e, shape)));
}

function makeShapeDraggableSecond(e, shape) {
    e.preventDefault(); // Предотвращаем выделение текста при перетаскивании и других нежелательных эффектов

    document.addEventListener('mouseup', onMouseUp); // Завершаем перетаскивание при отпускании мыши
    document.addEventListener('mousemove', onMouseMove); // Обновляем позицию фигуры при движении мыши

    const saw = document.getElementById('saw');

    // Получаем начальные координаты мыши и фигуры
    const rect = shape.getBoundingClientRect();
    const boardRect = getBoard().getBoundingClientRect();

    // Вычисляем смещение между позицией мыши и верхним левым углом фигуры
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Функция для обновления позиции фигуры при движении мыши
    function onMouseMove(e) {
        let left = e.clientX - boardRect.left - offsetX;
        let top = e.clientY - boardRect.top - offsetY;

        // Ограничение в пределах доски
        left = Math.max(0, Math.min(left, getBoard().clientWidth - shape.offsetWidth));
        top = Math.max(0, Math.min(top, getBoard().clientHeight - shape.offsetHeight));

        shape.style.left = left + 'px';
        shape.style.top = top + 'px';
    }

    // Функция для завершения перетаскивания и проверки попадания на пилу
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const sawRect = saw.getBoundingClientRect();
        const shapeRect = shape.getBoundingClientRect();

        const centerX = shapeRect.left + shapeRect.width / 2;
        const centerY = shapeRect.top + shapeRect.height / 2;

        const isOnSaw =
            centerX > sawRect.left &&
            centerX < sawRect.right &&
            centerY > sawRect.top &&
            centerY < sawRect.bottom;

        if (isOnSaw) checkDoneTask(shape);
    }
}