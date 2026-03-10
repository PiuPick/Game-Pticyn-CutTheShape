function initCustomCursor() {
    let cursor = document.getElementById('cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'cursor';
        cursor.innerHTML = '<img src="svg/saw.svg">';
        document.body.appendChild(cursor);
    }

    // Показываем кастомный курсор при наведении на игровое поле и скрываем системный курсор
    getBoard().addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
        getBoard().style.cursor = 'none';
    });

    // Обновляем позицию кастомного курсора при движении мыши над игровым полем
    getBoard().addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}