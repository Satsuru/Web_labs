// Генерация массива из 10 случайных чисел от 0 до 1
function generateRandomArray() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
        arr.push(Number(Math.random().toFixed(4)));
    }
    return arr;
}

// Сортировка массива по убыванию
function sortArrayDesc(arr) {
    return [...arr].sort((a, b) => b - a);
}

// Нахождение минимального элемента
function findMinElement(arr) {
    return Math.min(...arr);
}

// Отображение массива в таблице 2x5
function displayArrayInTable(arr, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    // Очищаем таблицу
    table.innerHTML = '';

    // Создаем 2 строки
    for (let row = 0; row < 2; row++) {
        const tr = document.createElement('tr');
        
        // 5 столбцов в каждой строке
        for (let col = 0; col < 5; col++) {
            const index = row * 5 + col;
            const td = document.createElement('td');
            td.textContent = arr[index];
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
}

export { generateRandomArray, sortArrayDesc, findMinElement, displayArrayInTable };