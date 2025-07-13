
//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//bird
let birdwidth = 34; //ratio = 17/12
let birdheight = 24;
let birdX = boardwidth / 8; //make the original position to the starting point
let birdY = boardheight / 2; 
let birdimg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}


//pipe (let the pipe be the array)
let pipeArray = [];
let pipewidth = 64; //ratio = 1/8
let pipeheight = 512;
let pipeX = boardwidth; 
let pipeY = 0; 

let toppipeimg;
let downpipeimg;


//image of UI
let GOIX = 50;
let GOIY = 250; 
let gameoverimg;

let GOI = {
    x : GOIX,
    y : GOIY,
}


//game physics
let velocityX = -2; // the speed of the moving pipes
let velocityY = 0; // the jump speed of the bird
let gamegravity = 0.4 // the speed of the bird go downward (big mon pc use 0.2)

let gameover = false;
let gamescore = 0;



window.onload = function() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext('2d'); //used for drawing on the board

    //draw and load th birdimage + pipeimage
    birdimg = new Image();
    birdimg.src = "./bird.png";
    birdimg.onload = function() {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }


    toppipeimg = new Image();
    toppipeimg.src = "./toppipe.png";
    downpipeimg = new Image();
    downpipeimg.src = "./downpipe.png";





    requestAnimationFrame(update);
    setInterval(placepipe, 1500); //1.5s gen 1 time (big mon pc use 1s)
    document.addEventListener("keydown", movebird);
    document.addEventListener("keydown", restart);
}


function update() {
    requestAnimationFrame(update);
    if (gameover) {
        return; //dont update anymore
    }
    context.clearRect(0, 0, board.width, board.height);


    //draw bird each frame
    velocityY += gamegravity;
    bird.y = Math.max(bird.y + velocityY, 0); // apply the gravity on the bird but not add the velocity directly and limit the height of the bird
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameover = true; // if the bird drop outside the board/screen, the game will over
    }

    //update the pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;  //before draw the pipes, shifting the x of the pipes 2px to left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            gamescore += 0.5; //cannot be one, will +2 to score
            pipe.passed = true; // update the score when pass one pipe
        }

        if (detectcollision(bird, pipe)) {
            gameover = true; //if the bird collide on the pipe, the game will over
        }
    }


    //clear the pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth) {
        pipeArray.shift(); //remove the first element from the array
    }


    // key tutor
    context.fillStyle = "black";
    context.font = "20px sans-serif";
    context.fillText("[↑ / Space] Jump    [R] Restart ", 25, 620);  


    // calculate the score
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.fillText("Score: ", 5, 45);
    context.fillText(gamescore, 150, 45);

    let gameoverimg = new Image();
    gameoverimg.src = "/gameover.png";

    if (gameover) {
        //context.drawImage(gameoverimg, GOI.x, GOI.y);
        context.fillText("GAMEOVER", 50, 250);
        context.font = "20px sans-serif";
        context.fillStyle = "white";
        context.fillText("Press [R/JUMP] to reset the game", 13, 285);
    }
}


//this function will be called every 1.5s (add new pipe to the pipe array)
function placepipe() {
    if (gameover) {
        return; //dont update the pipe anymore
    }

    // (0-1) * pipeHeight / 2
    // 0 --> -128 (pipeHeight / 4)
    // 1 --> -128 - 256 (pipeHeight / 4 - pipeHeight / 2) = -3/4 pipeHeight
    let randompipey = pipeY - pipeheight / 4 - Math.random()*(pipeheight / 2);
    let openingspace = board.height / 4
    // use to generate random pipeY by using (/)


    let toppipe = {
        img : toppipeimg,
        x : pipeX,
        y : randompipey,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }


    let downpipe = {
        img : downpipeimg,
        x : pipeX,
        y : randompipey + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(toppipe);
    pipeArray.push(downpipe);
}


function movebird(e) {
    if (e.code == "space" || e.code == "ArrowUp") {  // work when the player press the key
        // make the bird jump
        velocityY = -6;

        // reset the game
        if (gameover) {
            bird.y = birdY;
            pipeArray = [];
            gamescore = 0;
            gameover = false;
        }
    }
}


// restart the gam by pressing [R]
function restart(e) {
    if (e.code == "KeyR") {
        if (gameover) {
            bird.y = birdY;
            pipeArray = [];
            gamescore = 0;
            gameover = false;
        }
    }
}




function detectcollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}


