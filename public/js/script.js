$(document).ready(function() {
    // Сохраняем стихотворение
    $('#saveBtn').click(function() {
        const poem = $('#poemText').val();
        if (poem.split('\n').length !== 20) {
            alert('Стихотворение должно содержать ровно 20 строк!');
            return;
        }
        
        $.post('/save-poem', { poem: poem }, function() {
            alert('Стихотворение успешно сохранено!');
        });
    });
    
    // Преобразуем стихотворение
    $('#transformBtn').click(function() {
        const transformType = $('input[name="transformType"]:checked').val();
        
        $.post('/transform-poem', { transformType: transformType }, function() {
            alert('Стихотворение успешно преобразовано!');
        });
    });
    
    // Показываем оригинал
    $('#showOriginalBtn').click(function() {
        $.get('/get-poems', function(data) {
            $('#originalPoem').text(data.original).removeClass('hidden');
            $('#transformedPoem').addClass('hidden');
        });
    });
    
    // Показываем преобразованный вариант
    $('#showTransformedBtn').click(function() {
        $.get('/get-poems', function(data) {
            $('#transformedPoem').text(data.transformed).removeClass('hidden');
            $('#originalPoem').addClass('hidden');
        });
    });
});