function startThirdGame() {
    let shapes = nextTask();

    initCustomCursor();

    let activeKey = null;
    document.addEventListener('keydown', (e) => activeKey = e.key.toLowerCase());
    document.addEventListener('keyup', () => activeKey = null);

    getTask().innerHTML = `Нажмите клавишу 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_type[0]}</span> и дважды кликните по фигуре 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_type}</span> цвета 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_color}</span>`;

    shapes.forEach(shape =>
        shape.addEventListener('dblclick', () => {
            if (activeKey === correct_shape_type[0].toLowerCase())
                checkDoneTask(shape);
        }));

    // Двигаем фигуры каждые 100 мс
    setInterval(() => {
        shapes.forEach(shape => {
            // Генерируем случайное смещение для фигуры
            let dx = (Math.random() - 0.5) * 10;
            let dy = (Math.random() - 0.5) * 10;

            // Получаем текущие координаты фигуры
            let left = parseFloat(shape.style.left);
            let top = parseFloat(shape.style.top);

            // Ограничиваем движение фигуры в пределах игрового поля
            left = Math.min(Math.max(0, left + dx), getBoard().clientWidth - parseFloat(shape.style.getPropertyValue('--size')));
            top = Math.min(Math.max(0, top + dy), getBoard().clientHeight - parseFloat(shape.style.getPropertyValue('--size')));

            // Обновляем позицию фигуры
            shape.style.left = left + 'px';
            shape.style.top = top + 'px';
        });
    }, 100);
}