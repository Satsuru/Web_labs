document.addEventListener('DOMContentLoaded', () => {
    // Генерация данных
    const productCount = 10;
    const shopCount = 5;
    const imageCount = 10;
    
    // Названия магазинов (можно изменить)
    const shopNames = [
        "5 Элемент",
        "Электросила",
        "TTN.by",
        "DNS",
        "Эльдорадо"
    ];
    
    // Генерация случайных цен
    const generatePrices = () => {
        const prices = new Map();
        for (let product = 1; product <= productCount; product++) {
            const productPrices = new Map();
            for (let shop = 0; shop < shopCount; shop++) {
                productPrices.set(shop, Math.floor(Math.random() * 900) + 100);
            }
            prices.set(`Товар ${product}`, productPrices);
        }
        return prices;
    };
    
    const generateImages = () => {
        const images = new Set([
            '../RESOURCE/tov1.jpg',
            '../RESOURCE/tov2.jpg',
            '../RESOURCE/tov3.jpg',
            '../RESOURCE/tov4.jpg',
            '../RESOURCE/tov5.jpg',
            '../RESOURCE/tov6.jpg',
            '../RESOURCE/tov7.jpg',
            '../RESOURCE/tov8.jpg',
            '../RESOURCE/tov9.jpg',
            '../RESOURCE/tov10.jpg'
        ]);
        return images;
    };
    
    const prices = generatePrices();
    const images = generateImages();
    
    // Создание таблицы цен
    const createPriceTable = (pricesData) => {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        
        // Пустая ячейка для заголовка
        headerRow.appendChild(document.createElement('th'));
        
        // Заголовки магазинов
        shopNames.forEach(shopName => {
            const th = document.createElement('th');
            th.textContent = shopName;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        
        // Добавление строк с товарами и ценами
        let productIndex = 0;
        const imageArray = Array.from(images);
        
        pricesData.forEach((shopPrices, productName) => {
            const row = document.createElement('tr');
            const productCell = document.createElement('td');
            productCell.textContent = productName;
            row.appendChild(productCell);
            
            for (let shop = 0; shop < shopCount; shop++) {
                const priceCell = document.createElement('td');
                priceCell.textContent = shopPrices.get(shop);
                
                // Использование замыкания для сохранения индекса товара
                priceCell.addEventListener('click', ((index) => {
                    return () => {
                        const imageContainer = document.getElementById('productImageContainer');
                        imageContainer.innerHTML = `<img src="${imageArray[index % imageArray.length]}" alt="${productName}">`;
                    };
                })(productIndex));
                
                row.appendChild(priceCell);
            }
            
            table.appendChild(row);
            productIndex++;
        });
        
        return table;
    };
    
    // Заполнение выпадающего списка магазинов
    const fillShopSelect = () => {
        const select = document.getElementById('shopSelect');
        shopNames.forEach((shopName, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = shopName;
            select.appendChild(option);
        });
    };
    
    // Фильтрация цен по магазину
    const filterPricesByShop = (shopNumber) => {
        const filteredPrices = new Map();
        
        prices.forEach((shopPrices, productName) => {
            filteredPrices.set(productName, shopPrices.get(shopNumber));
        });
        
        // Сортировка по возрастанию цены
        const sortedEntries = [...filteredPrices.entries()].sort((a, b) => a[1] - b[1]);
        
        // Отображение результатов
        const container = document.getElementById('filteredPricesContainer');
        container.innerHTML = `<h3>Цены в магазине "${shopNames[shopNumber]}" (по возрастанию):</h3>`;
        
        const ol = document.createElement('ol');
        sortedEntries.forEach(([product, price]) => {
            const li = document.createElement('li');
            li.textContent = `${product}: ${price} руб.`;
            ol.appendChild(li);
        });
        
        container.appendChild(ol);
    };
    
    // Инициализация
    const init = () => {
        const table = createPriceTable(prices);
        document.getElementById('priceTableContainer').appendChild(table);
        fillShopSelect();
        
        // Обработчик кнопки фильтрации
        document.getElementById('filterBtn').addEventListener('click', () => {
            const shopSelect = document.getElementById('shopSelect');
            const selectedShop = parseInt(shopSelect.value);
            
            if (!isNaN(selectedShop)) {
                filterPricesByShop(selectedShop);
            } else {
                alert('Пожалуйста, выберите магазин');
            }
        });
    };
    
    // Использование bind для демонстрации
    const displayMessage = function(message, elementId) {
        document.getElementById(elementId).textContent = message;
    };
    
    const boundDisplayMessage = displayMessage.bind(null, 'Прайс-лист загружен', 'productImageContainer');
    setTimeout(boundDisplayMessage, 100);
    
    init();
});