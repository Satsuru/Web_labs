const form = document.getElementById('surveyForm');
const composerList = document.getElementById('composerList');
const resultsTableContainer = document.getElementById('resultsTableContainer');
const surveyFormSection = document.getElementById('surveyFormSection');
const resultsSection = document.getElementById('resultsSection');
const returnToFormButton = document.getElementById('returnToForm');
const showResultsLink = document.getElementById('showResultsLink');
const clearFormButton = document.getElementById('clearFormButton');
const userListContainer = document.getElementById('userListContainer');

const registeredPeople = []; // Список пользователей

let surveyResponses = []; // Хранит ответы пользователей

// Обновление списка пользователей на второй странице
function updateUserList() {
    if (!userListContainer) return;
    
    userListContainer.innerHTML = '';

    if (registeredPeople.length === 0) {
        userListContainer.innerHTML = '<option>Пока нет зарегистрированных пользователей</option>';
        return;
    }

    const userGroup = document.createElement('optgroup');
    userGroup.label = 'Зарегистрированные пользователи';

    registeredPeople.forEach(person => {
        const option = document.createElement('option');
        option.value = person.name;
        option.textContent = person.name;
        userGroup.appendChild(option);
    });

    userListContainer.appendChild(userGroup);
}

// Очистка формы
clearFormButton.addEventListener('click', () => {
    form.reset();
});

// Обработка отправки формы
form.addEventListener('submit', (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.name.trim()) throw new Error("Имя обязательно для заполнения.");
        if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error("Неверный формат email.");
        if (!data.era) throw new Error("Пожалуйста, выберите предпочитаемую эпоху.");
        if (!data.instruments) throw new Error("Пожалуйста, выберите хотя бы один инструмент.");

        // Добавление нового пользователя в список
        if (!registeredPeople.some(person => person.name === data.name)) {
            registeredPeople.push({ name: data.name });
        }

        // Сохранение ответа в таблицу
        surveyResponses.push({
            name: data.name,
            email: data.email,
            birthday: data.birthday || "Не указано",
            favoriteComposer: data.favoriteComposer || "Не указано",
            era: data.era,
            instruments: Array.isArray(data.instruments) ? data.instruments.join(', ') : data.instruments,
            listeningHabits: data.listeningHabits
        });

        // Обновление таблицы результатов
        let tableHTML = `<table><tr>
            <th>Имя</th><th>Email</th><th>Дата рождения</th>
            <th>Любимый композитор</th><th>Эпоха</th>
            <th>Инструменты</th><th>Частота прослушивания</th></tr>`;

        surveyResponses.forEach(response => {
            tableHTML += `<tr>
                <td>${response.name}</td>
                <td>${response.email}</td>
                <td>${response.birthday}</td>
                <td>${response.favoriteComposer}</td>
                <td>${response.era}</td>
                <td>${response.instruments}</td>
                <td>${response.listeningHabits}</td>
            </tr>`;
        });

        tableHTML += `</table>`;
        resultsTableContainer.innerHTML = tableHTML;

        updateUserList(); // Обновляем список пользователей

        form.reset();
        surveyFormSection.style.display = 'none';
        resultsSection.style.display = 'block';

    } catch (error) {
        alert(`Ошибка: ${error.message}`);
        console.error(error);
    }
});

// Показ страницы с результатами
showResultsLink.addEventListener('click', (event) => {
    event.preventDefault();
    surveyFormSection.style.display = 'none';
    resultsSection.style.display = 'block';
    updateUserList();
});

// Возврат к форме
returnToFormButton.addEventListener('click', () => {
    surveyFormSection.style.display = 'flex';
    resultsSection.style.display = 'none';
});

updateUserList();