// Генерация случайного массива
function generateArray() {
    return Array.from({length: 10}, () => Math.random().toFixed(4));
}

// Отображение массива в таблице
function displayArray(arr, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 5; j++) {
            const cell = row.insertCell();
            cell.textContent = arr[i*5 + j];
        }
    }
}

// Логика для главной страницы (index.html)
if (document.getElementById('originalArray')) {
    let arr;
    
    // Если массив уже есть в хранилище - берём его, иначе создаём новый
    if (sessionStorage.getItem('originalArray')) {
        arr = JSON.parse(sessionStorage.getItem('originalArray'));
    } else {
        arr = generateArray();
        sessionStorage.setItem('originalArray', JSON.stringify(arr));
    }
    
    displayArray(arr, 'originalArray');
}

// Логика для страницы результатов (results.html)
if (document.getElementById('sortedArray')) {
    const originalArray = JSON.parse(sessionStorage.getItem('originalArray'));
    const sortedArray = [...originalArray].sort((a, b) => b - a);
    const minElement = Math.min(...originalArray);
    
    displayArray(originalArray, 'originalArray');
    displayArray(sortedArray, 'sortedArray');
    document.getElementById('minElement').textContent = minElement;
}