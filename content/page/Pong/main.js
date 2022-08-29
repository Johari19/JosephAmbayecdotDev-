import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import Agent from "./Agent.js";

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.style = "border: 12px solid black;";
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1');

document.getElementById("main").appendChild(canvas);


 // Load a custom font to use.
 const myFont = new FontFace('Joystix', 'url(./Joystix.ttf)');

 myFont.load().then(font => {
	 document.fonts.add(font);
 });

let lastTime = 0;

const player1 = new Paddle(30, 30, 20, 200, CANVAS_HEIGHT);
const player2 = new Paddle(CANVAS_WIDTH - 50, 30, 20, 200, CANVAS_HEIGHT);
let player1Score = 0;
let player2Score = 0;

 // Initialize the agent for player 2
 const agent = new Agent(player2);

let versusAi = false;
const twoPlayerButton = document.getElementById("2p");
const onePlayerButton = document.getElementById("1p");

let servingPlayer = 1;
let winningPlayer;

const VICTORY_SCORE = 10;

const ball = new Ball(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10, 20, 20, CANVAS_HEIGHT);
let gameState = 'start';


const keys = {};

const sounds = {
    score: new Audio('./sounds/score.wav'),
};


canvas.addEventListener('keydown', event => {
    keys[event.key] = true;
})

canvas.addEventListener('keyup', event => {
    keys[event.key] = false;
})


function gameLoop(currentTime = 0) {
    const deltaTime = (currentTime - lastTime) / 1000;
    update(deltaTime);
    lastTime = currentTime;
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (keys.Enter) {
        keys.Enter = false;

        if (gameState === 'start') {
            gameState = 'serve';
        }
        else if (gameState === 'serve'){
            gameState = 'play';
        }
        else if (gameState === 'victory'){
            gameState = 'serve';
            player1Score = 0;
            player2Score = 0;
            servingPlayer = winningPlayer;
        }

    }

    versusAi = onePlayerButton.checked ? true : false;
    
    if (keys.w && keys.s)
        player1.stop();
    else if (keys.w) {
        player1.moveUp();
    }
    else if (keys.s) {
        player1.moveDown();
    }
    else {
        player1.stop();
    }

    if (!versusAi) {
        if (keys.ArrowUp && keys.ArrowDown)
            player2.stop();
        else if (keys.ArrowUp) {
            player2.moveUp();
        }
        else if (keys.ArrowDown) {
            player2.moveDown();
        }
        else {
            player2.stop();
        }
    }
    else {
        if (ball.x >= CANVAS_WIDTH / 2) {
            agent.trackBall(ball);
        }
        else
            agent.stop()
    }

    if (gameState === 'play') {
        ball.update(dt, player1, player2);
        if(ball.x + ball.width < 0){
            sounds.score.play();
            player2Score++;
            servingPlayer = 2;
            
            if (player2Score === VICTORY_SCORE){
                winningPlayer = 2;
                gameState = 'victory';
            }
            else {
                ball.reset(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10, servingPlayer);
                gameState = 'serve';
            }
        }
        else if (ball.x > CANVAS_WIDTH){
            sounds.score.play();
            player1Score++;
            servingPlayer = 1;

            if (player1Score === VICTORY_SCORE){
                winningPlayer = 2;
                gameState = 'victory';
            }
            else {
                ball.reset(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10), servingPlayer;
                gameState = 'serve';
            }
        }
    }
    

    player1.update(dt);
    player2.update(dt);
    render();
}

function render() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = `rgb(0, 0, 153)`;
    context.fillRect(0, 0, CANVAS_WIDTH,  CANVAS_HEIGHT);
    context.fillStyle = 'white';
    player1.render(context);
    ball.render(context); // Ball
    player2.render(context);

    context.font = '60px Joystix';
    context.fillStyle = 'white';
    context.textAlign = 'center';

    // Render scores at the top of the screen.
    context.fillText(`${player1Score}`, CANVAS_WIDTH * 0.25, 75);
    context.fillText(`${player2Score}`, CANVAS_WIDTH * 0.75, 75);


    context.font = "24px Joystix";

    if (gameState === 'start') {
        context.fillText(`🏓 Welcome to Pong 🏓`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        context.fillText(`Press Enter to begin!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 40);
    }
    else if (gameState === 'serve') {
        context.fillText(`Player ${servingPlayer}'s serve...`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        context.fillText(`Press Enter to serve!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 40);
    }
    else if (gameState === 'victory') {
        context.fillText(`🎉 Player ${winningPlayer} wins! 🎉`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        context.fillText(`Press Enter to restart!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 40);
    }
}
gameLoop();
canvas.focus();

