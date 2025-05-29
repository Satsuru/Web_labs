const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Пути к файлам
const DATA_DIR = path.join(__dirname, 'data');
const ORIGINAL_POEM = path.join(DATA_DIR, 'original_poem.txt');
const TRANSFORMED_POEM = path.join(DATA_DIR, 'transformed_poem.txt');

// Создаем папку data если её нет
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Сохраняем оригинальное стихотворение
app.post('/save-poem', (req, res) => {
    const poem = req.body.poem;
    fs.writeFileSync(ORIGINAL_POEM, poem);
    res.sendStatus(200);
});

// Преобразуем стихотворение
app.post('/transform-poem', (req, res) => {
    const transformType = req.body.transformType;
    const originalPoem = fs.readFileSync(ORIGINAL_POEM, 'utf-8');
    
    let transformed;
    if (transformType === 'uppercase') {
        transformed = originalPoem.split('\n').map(line => line.toUpperCase()).join('\n');
    } else {
        transformed = originalPoem.replace(/\n/g, ' ');
    }
    
    fs.writeFileSync(TRANSFORMED_POEM, transformed);
    res.sendStatus(200);
});

// Получаем стихотворения
app.get('/get-poems', (req, res) => {
    try {
        const original = fs.readFileSync(ORIGINAL_POEM, 'utf-8');
        const transformed = fs.readFileSync(TRANSFORMED_POEM, 'utf-8');
        res.json({ original, transformed });
    } catch (e) {
        res.status(500).json({ error: 'Files not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});