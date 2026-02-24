function startFirstGame() {
    let shapes = nextTask();

    initCustomCursor()

    getTask().innerHTML = `Дважды кликните по фигуре 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_type}</span> цвета 
    <span style="color:${correct_shape_color}; font-weight:bold;">${correct_shape_color}</span>`;

    shapes.forEach(shape =>
        shape.addEventListener('dblclick', () => checkDoneTask(shape)));
}