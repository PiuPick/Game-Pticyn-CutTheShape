document.addEventListener("DOMContentLoaded", initRating);

function initRating() {
    createStructureRating();
    renderRating();
}

function createStructureRating() {
    addTemplateTag('rating', 'div',
        `<h1>🏆 Рейтинг игроков 🏆</h1>
        <table id="rating-table">
            <thead>
                <tr>
                    <th>Место</th>
                    <th>Имя игрока</th>
                    <th>Лучший счет</th>
                    <th>Достигнутый уровень</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>`);

    addExitButton().textContent = 'Обратно в меню';
}

function renderRating() {
    const rating = getRating();

    const tbody = document.querySelector('#rating-table tbody');
    tbody.innerHTML = '';

    if (rating.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    Пока нет игроков в рейтинге.<br>
                    Сыграйте в игру, чтобы появиться здесь!
                </td>
            </tr>`;
        return;
    }

    rating
        .sort((a, b) => {
            if (b.bestScore !== a.bestScore)
                return b.bestScore - a.bestScore;
            return b.bestLevel - a.bestLevel;
        })
        .slice(0, 10)
        .forEach((player, index) => {
            const isCurrentUser = player.name === getName(); // проверяем текущего игрока
            const displayName = isCurrentUser ? `${player.name} (вы)` : player.name;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${displayName}</td>
                <td>${player.bestScore}</td>
                <td>${player.bestLevel}</td>
            `;
            tbody.appendChild(row);
        });
}
