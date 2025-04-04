document.getElementById('red').addEventListener('click', function() {
    applyStyle('red');
});

document.getElementById('blue').addEventListener('click', function() {
    applyStyle('blue');
});

document.getElementById('green').addEventListener('click', function() {
    applyStyle('green');
});

document.getElementById('showOptions').addEventListener('click', function() {
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;
    const fontSize = document.getElementById('fontSize').value;
    const color = document.querySelector('button:focus') ? document.querySelector('button:focus').id : 'black';

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<p style="font-size: ${fontSize}; color: ${color};">${fontSize} ${color} ${text1}</p>`);
    newWindow.document.write(`<p style="font-size: ${fontSize}; color: ${color};">${fontSize} ${color} ${text2}</p>`);
    newWindow.document.close();
});

function applyStyle(color) {
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;
    const fontSize = document.getElementById('fontSize').value;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<p style="font-size: ${fontSize}; color: ${color};">${text1}</p>`);
    newWindow.document.write(`<p style="font-size: ${fontSize}; color: ${color};">${text2}</p>`);
    newWindow.document.close();
}
