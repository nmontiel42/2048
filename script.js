// Variable global para la puntuación
let score = 0;

/* -------------- CREAR TABLERO -------------- */

// El tablero con una matriz 4x4
const grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Función para imprimir el tablero
function printGrid() {
    const gridContainer = document.getElementById('grid-container');
    const scoreContainer = document.getElementById('score');
    gridContainer.innerHTML = ''; // Limpia el contenido existente

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Crea un elemento div por cada celda
            const tile = document.createElement('div');
            tile.classList.add("tile");

            // Añade una clase de color según el valor
            const value = grid[i][j];
            if (value === 0) {
                tile.classList.add("empty"); // Clase para celdas vacías
            } else {
                tile.classList.add(`tile-${value}`); // Clase para cada valor
            }

            // Muestra el valor vacío si no hay nada
            tile.textContent = grid[i][j] === 0 ? '' : grid[i][j];

            // Añade cada celda al contenedor
            gridContainer.appendChild(tile);
        }
    }

    // Muestra la puntuación y la actualiza
    scoreContainer.textContent = `Score: ${score}`;
}

// Función para generar un número aleatorio
function generateRandomNumber() {
    const emptyTiles = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0)
                emptyTiles.push({ row: i, col: j });
        }
    }

    // Si hay celdas vacías, no hace nada
    if (emptyTiles.length === 0)
        return;

    // Elige una posición aleatoria de las celdas vacías
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    // Genera un número aleatorio 2 o 4
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;

    // Redibuja el tablero con los nuevos valores
    printGrid();
}

/* -------------- MOVIMIENTO -------------- */

// Creamos un detector de eventos para las teclas
document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        default:
            return;
    }

    // Después de cada movimiento, se genera un nuevo número
    generateRandomNumber();

    // Redibujamos el tablero
    printGrid();

    if (isGameOver()) {
        alert('Game Over!');
        updateScore(score);
    }
    if (isGameWon()) {
        alert('You Win!');
        updateScore(score);
    }
}

// Funciones para mover los números según la flecha
function moveLeft() {
    for (let i = 0; i < grid.length; i++) {
        // Filtrar los números quitando el 0
        let row = grid[i].filter(val => val !== 0);

        // Combina las celdas del mismo número
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j]; // Suma la puntuación
                row[j + 1] = 0; // Elimina la que acaba de combinar
            }
        }

        row = row.filter(val => val !== 0); // Filtrar los 0s que quedaron

        // Rellenar con 0s al final
        while (row.length < 4)
            row.push(0);

        // Actualizamos la fila en la matriz
        grid[i] = row;
    }
    updateScore(score);
}

function moveRight() {
    for (let i = 0; i < grid.length; i++) {
        // Invierte la fila
        grid[i] = grid[i].reverse();

        let row = grid[i].filter(val => val !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row[j + 1] = 0;
            }
        }

        row = row.filter(val => val !== 0);
        while (row.length < 4)
            row.push(0);
        grid[i] = row;

        // Vuelve a invertirla
        grid[i] = grid[i].reverse();
    }
}

function moveUp() {
    transposeGrid();
    moveLeft();
    transposeGrid();
}

function moveDown() {
    transposeGrid();
    moveRight();
    transposeGrid();
}

function transposeGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = i; j < grid[i].length; j++) {
            // Intercambiamos valores
            const temp = grid[i][j];
            grid[i][j] = grid[j][i];
            grid[j][i] = temp;
        }
    }
}

/* -------------- VERIFICAR FIN JUEGO -------------- */

// Función para ver si el juego acabó
function isGameOver() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // Verifica celdas vacías
            if (grid[i][j] === 0)
                return false;

            // Verifica posibles combinaciones
            if (i < 3 && grid[i][j] === grid[i + 1][j])
                return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1])
                return false;
        }
    }
    return true;
}

// Función para ver si se ganó el juego
function isGameWon() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 2048)
                return true;
        }
    }
    return false;
}

/* -------------- REINICIAR JUEGO -------------- */

// Función para reiniciar el tablero
function restartGame() {
    score = 0;

    // Pone todo el tablero de nuevo en 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
    generateRandomNumber();
    generateRandomNumber();
    printGrid();
    displayBestScore();
}

// Evento para reiniciar al hacer click en el botón
document.getElementById('restart-btn').addEventListener('click', restartGame);

/* -------------- MEJOR PUNTUACION -------------- */


// Obtener la mejor puntuación guardada
function getBestScore() {
    return localStorage.getItem('bestScore') || 0; // Retorna 0 si no hay puntuación guardada
}

// Función para guardar la nueva mejor puntuación
function setBestScore() {
    const bestScore = getBestScore();
    if (score > bestScore) {
        localStorage.setItem('bestScore', score); // Guarda la nueva puntuación
    }
}

// Función para mostrar la mejor puntuación en la interfaz
function displayBestScore() {
    const bestScore = getBestScore();
    document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
}

// Función que se llama cuando el juego termina o cuando se actualiza la puntuación
function updateScore(score) {
    setBestScore(); // Llama a setBestScore para actualizar la mejor puntuación
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Llamar a la función para mostrar la mejor puntuación
window.onload = function() {
    displayBestScore();
};

/* -------------- INICIALIZAR EL JUEGO -------------- */

// Inicializar el tablero con 2 valores nuevos
generateRandomNumber();
generateRandomNumber();
printGrid();