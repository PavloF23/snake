const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
// кординати їди та змії
let foodX, foodY;
let snakeX = 10, snakeY = 15;

let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// отримання знячення нуль з хранилища
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


// функція для рандомного переміщеня їди по ігровому полю
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//  для перезапуска таймера та перезапуску
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press ok to replay...");
    location.reload();
}

//фунція для відслідковування кнопок
const changeDirection = (evt) => {
    // console.log(evt);
    if(evt.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(evt.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = +1;
    } else if(evt.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(evt.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    // відслідковування кликів по візуальним кнопкам на ігровому полі
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

// функція для розмищення їди та змії на ігровом полі
const initGame = () => {
    
    if(gameOver) return handleGameOver();
    // умова для розмищення їди на ігровом полі
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //добавлення тіла змії після з'їдення їди
        score++;    //ведення рахунку

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore)
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // збільшення елементів в тілі змії на один
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // позиція голови змії на ігровом полі

    // оновлення позиції голови змії при натискані на кнопки
    snakeX += velocityX;
    snakeY += velocityY;

    //  умова закінчення гри при виходу за межі ігрового поля
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // умова для розмищення змії на ігровом полі
    for (let i = 0; i < snakeBody.length; i++) {
        // добавлення в div лелемантів тіла змії
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;   
        // умова програшу при зіткненю змії на себе 
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection)