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

            // Añade la clase de animación
            tile.classList.add("tile-animation");

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

// Funciones para mover los números según la flecha
function moveLeft() 
{
    let hasMove = false;
    for (let i = 0; i < grid.length; i++) {
        // Filtrar los números quitando el 0
        let row = grid[i].filter(val => val !== 0);

        // Combina las celdas del mismo número
        for (let j = 0; j < row.length - 1; j++)
        {
            if (row[j] === row[j + 1])
            {
                row[j] *= 2;
                score += row[j]; // Suma la puntuación
                row[j + 1] = 0; // Elimina la que acaba de combinar
                hasMove = true;
            }
        }

        row = row.filter(val => val !== 0); // Filtrar los 0s que quedaron

        // Rellenar con 0s al final
        while (row.length < 4)
            row.push(0);

        // Actualizamos la fila en la matriz
        grid[i] = row;
        hasMove = true;
        
    }
    return hasMove;
}

function moveRight()
{
    let hasMove = false;
    for (let i = 0; i < grid.length; i++) {
        // Invierte la fila
        grid[i] = grid[i].reverse();

        let row = grid[i].filter(val => val !== 0);
        for (let j = 0; j < row.length - 1; j++)
        {
            if (row[j] === row[j + 1])
            {
                row[j] *= 2;
                score += row[j];
                row[j + 1] = 0;
                hasMove = true;
            }
        }

        row = row.filter(val => val !== 0);
        while (row.length < 4)
            row.push(0);
        grid[i] = row;

        // Vuelve a invertirla
        grid[i] = grid[i].reverse();
        hasMove = true;
    }
    return hasMove;
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

/* -------------- MEJOR PUNTUACION -------------- */

// Función para actualizar la puntuación
function updateScore(score) {
    const bestScore = getBestScore();
    if (score > bestScore) {
        localStorage.setItem('bestScore', score);
    }
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Obtener la mejor puntuación guardada
function getBestScore() {
    return localStorage.getItem('bestScore') || 0;
}

// Función para mostrar la mejor puntuación en la interfaz
function displayBestScore() {
    const bestScore = getBestScore();
    document.getElementById('best-score').textContent = `Best Score: ${bestScore}`;
}

/* -------------- GESTOS DE DESLIZAMIENTO -------------- */

// Variables para gestos táctiles
let startX, startY, endX, endY;
let isTouchMove = false;

document.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    isTouchMove = false; // Reseteamos el estado de movimiento
}, false);

document.addEventListener('touchend', function(e) {
    const touch = e.changedTouches[0];
    endX = touch.pageX;
    endY = touch.pageY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    // Solo consideramos un deslizamiento si el movimiento es mayor a un umbral mínimo (por ejemplo, 30px)
    if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
        isTouchMove = true;
    }

    // Si hubo un deslizamiento, lo procesamos, sino no hacemos nada
    if (isTouchMove) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                console.log('Deslizar hacia la derecha');
                moveRight(); // Llama a la función para mover las celdas a la derecha
            } else {
                console.log('Deslizar hacia la izquierda');
                moveLeft(); // Llama a la función para mover las celdas a la izquierda
            }
        } else {
            if (diffY > 0) {
                console.log('Deslizar hacia abajo');
                moveDown(); // Llama a la función para mover las celdas hacia abajo
            } else {
                console.log('Deslizar hacia arriba');
                moveUp(); // Llama a la función para mover las celdas hacia arriba
            }
        }

        // Después de cada movimiento, genera un nuevo número y actualiza el tablero
        generateRandomNumber();
        printGrid();

        // Verifica si el juego terminó
        if (isGameOver()) {
            alert('Game Over!');
            updateScore(score);
        }

        // Verifica si el jugador ha ganado
        if (isGameWon()) {
            alert('You Win!');
        }
    }
}, false);

/* -------------- TECLAS DE DIRECCIÓN -------------- */

// Función para escuchar las teclas de dirección
document.addEventListener('keydown', function(e)
{
    let hasMove = false;
    if (e.key === 'ArrowLeft') {
        hasMove = moveLeft(); // Llama a la función para mover las celdas a la izquierda
    } else if (e.key === 'ArrowRight') {
        hasMove = moveRight(); // Llama a la función para mover las celdas a la derecha
    } else if (e.key === 'ArrowUp') {
        hasMove = moveUp();// Llama a la función para mover las celdas hacia arriba
    } else if (e.key === 'ArrowDown') {
        hasMove = moveDown(); // Llama a la función para mover las celdas hacia abajo
    }

    
    if (hasMove)
    {// Después de cada movimiento, genera un nuevo número y actualiza el tablero
        generateRandomNumber();
        hasMove = false;
    }
    printGrid();

    // Verifica si el juego terminó
    if (isGameOver()) {
        alert('Game Over!');
        updateScore(score);
    }

    // Verifica si el jugador ha ganado
    if (isGameWon()) {
        alert('You Win!');
    }
});

// Inicializar la mejor puntuación
displayBestScore();


/* -------------- BOTÓN DE REINICIO -------------- */

// Función para reiniciar el juego
function restartGame() {
    // Resetea el tablero a su estado inicial
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }

    // Reinicia la puntuación
    score = 0;
    updateScore(score);

    // Genera dos números aleatorios al iniciar
    generateRandomNumber();
    generateRandomNumber();

    // Imprime el tablero actualizado
    printGrid();
    displayBestScore();
}

// Asocia el evento del botón de reinicio
document.getElementById('restart-btn').addEventListener('click', function() {
    restartGame();
});

/* -------------- INICIALIZAR EL JUEGO -------------- */

// Inicializar el tablero con 2 valores nuevos
generateRandomNumber();
generateRandomNumber();
printGrid();
