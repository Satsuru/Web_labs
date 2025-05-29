class BookDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.paragraphContainer = document.getElementById('paragraph-container');
        this.imageContainer = document.getElementById('image-container');
        this.infoDisplay = document.getElementById('info-display');
        this.paragraphs = new Map();
        this.images = new Map();
        this.styles = {
            normal: { fontWeight: 'bold', backgroundColor: '#e9f2ff' },
            highlight: { fontWeight: 'bold', backgroundColor: '#ffeb3b', color: '#000' },
            quote: { fontStyle: 'italic', borderLeft: '4px solid #ff5722' }
        };
    }

    // Второй конструктор
    static createWithCustomStyles(containerId, styles) {
        const instance = new BookDisplay(containerId);
        instance.styles = styles;
        return instance;
    }

    // Третий конструктор
    static createWithInitialData(containerId, initialBooks) {
        const instance = new BookDisplay(containerId);
        instance.renderInitialContent(initialBooks);
        return instance;
    }

    addImage(src, alt, id = null) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.border = '2px solid #4a6fa5';
        img.style.borderRadius = '5px';
        img.style.width = '150px';
        img.style.height = 'auto';
        img.style.margin = '10px';
        
        const imgId = id || `img-${Date.now()}`;
        this.images.set(imgId, { element: img, src, alt });
        return { id: imgId, element: img };
    }

    addParagraph(text, id = null, style = 'normal') {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.width = '150px';
        p.style.textAlign = 'center';
        p.style.margin = '5px 10px';
        p.style.padding = '10px';
        p.style.borderRadius = '5px';
        
        // Применяем стиль
        Object.assign(p.style, this.styles[style] || this.styles.normal);
        
        const pId = id || `p-${Date.now()}`;
        this.paragraphs.set(pId, { element: p, text, style });
        return { id: pId, element: p };
    }

    renderInitialContent(books) {
        books.forEach(({ src, alt, title }, index) => {
            const { element: img } = this.addImage(src, alt, `book-img-${index}`);
            const { element: p } = this.addParagraph(title, `book-title-${index}`);
            this.imageContainer.appendChild(img);
            this.paragraphContainer.appendChild(p);
        });
    }

    insertElement(elem, positionSelector, type) {
        const container = type === 'paragraph' ? this.paragraphContainer : this.imageContainer;
        const collection = type === 'paragraph' ? this.paragraphs : this.images;
        const elements = Array.from(collection.values()).map(item => item.element);
        const position = document.querySelector(`input[name="${positionSelector}"]:checked`).value;

        if (elements.length === 0 || position === 'after') {
            container.appendChild(elem);
        } else {
            container.insertBefore(elem, elements[0]);
        }
    }

    displayAsList() {
        let html = '<h3>Список книг:</h3><ul>';
        this.paragraphs.forEach((paragraph, id) => {
            html += `<li>${paragraph.text} (ID: ${id})</li>`;
        });
        html += '</ul>';
        this.infoDisplay.innerHTML = html;
    }

    displayAsText() {
        let text = 'Книжные новинки:\n\n';
        this.paragraphs.forEach(paragraph => {
            text += `- ${paragraph.text}\n`;
        });
        this.infoDisplay.textContent = text;
    }

    filterBooks(filterText) {
        const filtered = new Map();
        this.paragraphs.forEach((paragraph, id) => {
            if (paragraph.text.toLowerCase().includes(filterText.toLowerCase())) {
                filtered.set(id, paragraph);
            }
        });
        
        let html = '<h3>Результаты фильтрации:</h3>';
        if (filtered.size > 0) {
            html += '<ul>';
            filtered.forEach((paragraph, id) => {
                html += `<li>${paragraph.text} (ID: ${id})</li>`;
            });
            html += '</ul>';
        } else {
            html += '<p>Ничего не найдено.</p>';
        }
        this.infoDisplay.innerHTML = html;
    }
}

class BookEditor extends BookDisplay {
    constructor(containerId) {
        super(containerId);
    }

    addNewParagraph() {
        const text = prompt("Введите название книги:", "Пир стервятников");
        if (!text) return null; // если пользователь отменил ввод
        
        const style = document.getElementById('paragraph-style').value;
        const { id, element } = this.addParagraph(text, null, style);
        this.insertElement(element, 'paragraph-pos', 'paragraph');
        return id;
    }

    addNewImage() {
        const { id, element } = this.addImage("../resource/new_book.jpg", "Новая книга");
        this.insertElement(element, 'image-pos', 'image');
        return id;
    }
}

// Инициализация с начальными данными
const books = [
    { src: '../resource/GOT1.jpg', alt: 'Игра престолов', title: 'Игра престолов' },
    { src: '../resource/GOT2.jpg', alt: 'Битва королей', title: 'Битва королей' },
    { src: '../resource/GOT3.jpg', alt: 'Буря мечей', title: 'Буря мечей' },
];

// Создаем основной экземпляр редактора
const editor = new BookEditor('book-container');
editor.renderInitialContent(books);

// обработчики событий
document.getElementById('add-paragraph').addEventListener('click', () => {
    editor.addNewParagraph();
});

document.getElementById('add-image').addEventListener('click', () => {
    editor.addNewImage();
});

document.getElementById('show-as-list').addEventListener('click', () => {
    editor.displayAsList();
});

document.getElementById('show-as-text').addEventListener('click', () => {
    editor.displayAsText();
});

document.getElementById('filter-books').addEventListener('click', () => {
    const searchTerm = prompt('Введите текст для поиска:');
    if (searchTerm) {
        editor.filterBooks(searchTerm);
    }
});