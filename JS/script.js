class SchoolApp {
    constructor() {
        this.students = [];
        this.additionalProperties = {};
        this.history = [];
        this.loadFromLocalStorage();
        this.initElements();
        this.bindEvents();
        this.renderStudentsTable();
        this.updateStudentSelect();
        this.updateRemovePropertySelect();
        this.renderHistory();
    }

    initElements() {
        this.elements = {
            studentForm: document.getElementById('studentForm'),
            fio: document.getElementById('fio'),
            address: document.getElementById('address'),
            class: document.getElementById('class'),
            olympiad: document.getElementById('olympiad'),
            addStudent: document.getElementById('addStudent'),
            clearForm: document.getElementById('clearForm'),
            showNonOlympiad: document.getElementById('showNonOlympiad'),
            deleteStudent: document.getElementById('deleteStudent'),
            clearHistory: document.getElementById('clearHistory'),
            studentSelect: document.getElementById('studentSelect'),
            studentsTable: document.getElementById('studentsTable').querySelector('tbody'),
            newProperty: document.getElementById('newProperty'),
            newPropertyValue: document.getElementById('newPropertyValue'),
            addProperty: document.getElementById('addProperty'),
            removeProperty: document.getElementById('removeProperty'),
            removePropertyBtn: document.getElementById('removePropertyBtn'),
            historyLog: document.getElementById('historyLog'),
            result: document.getElementById('result')
        };
    }

    bindEvents() {
        this.elements.addStudent.addEventListener('click', () => this.addStudent());
        this.elements.clearForm.addEventListener('click', () => this.clearForm());
        this.elements.showNonOlympiad.addEventListener('click', () => this.showNonOlympiadStudents());
        this.elements.deleteStudent.addEventListener('click', () => this.deleteSelectedStudent());
        this.elements.addProperty.addEventListener('click', () => this.addNewProperty());
        this.elements.removePropertyBtn.addEventListener('click', () => this.removeProperty());
        this.elements.clearHistory.addEventListener('click', () => this.clearHistory());
    }

    addStudent() {
        const student = {
            id: Date.now(),
            fio: this.elements.fio.value,
            address: this.elements.address.value,
            class: this.elements.class.value,
            olympiad: this.elements.olympiad.value,
            additional: {...this.additionalProperties}
        };

        this.students.push(student);
        this.saveToLocalStorage();
        this.renderStudentsTable();
        this.updateStudentSelect();
        this.clearForm();
        
        this.addHistoryEntry(`Добавлена новая запись с ID ${student.id}: ${student.fio}`);
    }

    clearForm() {
        this.elements.fio.value = '';
        this.elements.address.value = '';
        this.elements.class.value = '';
        this.elements.olympiad.value = 'yes';
    }

    deleteSelectedStudent() {
        const selectedId = parseInt(this.elements.studentSelect.value);
        if (!selectedId) return;

        const student = this.students.find(s => s.id === selectedId);
        this.students = this.students.filter(student => student.id !== selectedId);
        this.saveToLocalStorage();
        this.renderStudentsTable();
        this.updateStudentSelect();
        
        if (student) {
            this.addHistoryEntry(`Удалена запись с ID ${student.id}: ${student.fio}`);
        }
    }

    showNonOlympiadStudents() {
        const nonOlympiadStudents = this.students.filter(student => student.olympiad === 'no');
        const resultText = nonOlympiadStudents.length > 0 
            ? `Ученики, не участвовавшие в олимпиадах: ${nonOlympiadStudents.map(s => s.fio).join(', ')}`
            : 'Все ученики участвовали в олимпиадах.';
        
        this.elements.result.textContent = resultText;
    }

    addNewProperty() {
        const propertyName = this.elements.newProperty.value;
        const propertyValue = this.elements.newPropertyValue.value;

        if (!propertyValue) {
            alert('Введите значение свойства!');
            return;
        }

        this.additionalProperties[propertyName] = propertyValue;
        this.saveToLocalStorage();
        this.updateRemovePropertySelect();
        this.elements.newPropertyValue.value = '';
        this.renderStudentsTable();
        
        this.addHistoryEntry(`Добавлено новое свойство: ${propertyName} = ${propertyValue}`);
    }

    removeProperty() {
        const propertyName = this.elements.removeProperty.value;
        if (!propertyName) return;

        delete this.additionalProperties[propertyName];
        this.students.forEach(student => {
            if (student.additional && student.additional[propertyName]) {
                delete student.additional[propertyName];
            }
        });

        this.saveToLocalStorage();
        this.updateRemovePropertySelect();
        this.renderStudentsTable();
        
        this.addHistoryEntry(`Удалено свойство: ${propertyName}`);
    }

    renderStudentsTable() {
        this.elements.studentsTable.innerHTML = '';
        this.students.forEach(student => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.fio}</td>
                <td>${student.address}</td>
                <td>${student.class}</td>
                <td>${student.olympiad === 'yes' ? 'Да' : 'Нет'}</td>
                <td>${this.formatAdditionalProperties(student.additional)}</td>
            `;

            this.elements.studentsTable.appendChild(row);
        });
    }

    formatAdditionalProperties(additional) {
        if (!additional || Object.keys(additional).length === 0) return 'Нет';
        return Object.entries(additional).map(([key, value]) => `${key}: ${value}`).join(', ');
    }

    updateStudentSelect() {
        this.elements.studentSelect.innerHTML = '<option value="">Выберите ученика</option>';
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.fio} (ID: ${student.id})`;
            this.elements.studentSelect.appendChild(option);
        });
    }

    updateRemovePropertySelect() {
        this.elements.removeProperty.innerHTML = '<option value="">Выберите свойство</option>';
        Object.keys(this.additionalProperties).forEach(property => {
            const option = document.createElement('option');
            option.value = property;
            option.textContent = property;
            this.elements.removeProperty.appendChild(option);
        });
    }

    addHistoryEntry(message) {
        const timestamp = new Date().toLocaleString();
        this.history.push({
            timestamp,
            message
        });
        this.saveToLocalStorage();
        this.renderHistory();
    }

    renderHistory() {
        this.elements.historyLog.innerHTML = '';
        
        this.history.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.innerHTML = `<strong>[${entry.timestamp}]</strong> ${entry.message}`;
            this.elements.historyLog.appendChild(entryElement);
        });
        
        this.elements.historyLog.scrollTop = this.elements.historyLog.scrollHeight;
    }

    clearHistory() {
        this.history = [];
        this.saveToLocalStorage();
        this.renderHistory();
    }

    saveToLocalStorage() {
        localStorage.setItem('schoolAppStudents', JSON.stringify(this.students));
        localStorage.setItem('schoolAppProperties', JSON.stringify(this.additionalProperties));
        localStorage.setItem('schoolAppHistory', JSON.stringify(this.history));
    }

    loadFromLocalStorage() {
        const savedStudents = localStorage.getItem('schoolAppStudents');
        const savedProperties = localStorage.getItem('schoolAppProperties');
        const savedHistory = localStorage.getItem('schoolAppHistory');

        this.students = savedStudents ? JSON.parse(savedStudents) : [];
        this.additionalProperties = savedProperties ? JSON.parse(savedProperties) : {};
        this.history = savedHistory ? JSON.parse(savedHistory) : [];
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new SchoolApp();
});