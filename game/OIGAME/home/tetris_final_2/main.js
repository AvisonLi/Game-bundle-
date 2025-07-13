function init() {
    canvas.width=canvas_width;
    canvas.height=canvas_height;
}

//a function for generating random integer
function randomInt(min,max){
    return Math.round(min+Math.random()*(max-min));
}

function genTetromino(){
  var tetrominoBag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  let randIndex;
  let selected;
  while (tetrominoBag.length) {
    randIndex = randomInt(0, tetrominoBag.length - 1);
    selected = tetrominoBag.splice(randIndex, 1)[0];
    tetrominoQueue.push(selected);
  }
}

function prepTetromino(aname){
  this.name=aname
  this.matrix = tetrominos[aname];
  this.row = aname == 'I' ? -1 : -2;// I and O start centered, others start one column from middle
  this.col = playfield[0].length / 2 - Math.ceil(this.matrix[0].length / 2);
}

function display(mode,holdtetromino){
  let dtetrominoname=mode=='prev'?tetrominoQueue[0]:holdtetromino.name;
  let dmatrix=tetrominos[dtetrominoname];
  let dColPix = ((mode=='prev'?prevcanvas:holdcanvas).width - dmatrix[0].length*grid) / 2;
  let dRowPix = ((mode=='prev'?prevcanvas:holdcanvas).height - (dtetrominoname === 'I' ? 4 : 3)*grid)/2+25;
  return {
    name:dtetrominoname,
    matrix: dmatrix,
    colpix: dColPix,
    rowpix: dRowPix
  };
}

// get the next tetromino (preview) in the sequence	
function getTetromino() {
  if (tetrominoQueue.length <= 1) {	// for preview
    genTetromino();
  }
  let activeTetrominoName = tetrominoQueue.shift();	
  let temp = new prepTetromino(activeTetrominoName);
  return temp;
}

function rotate(oldMatrix,direction){
  let lenIndex=oldMatrix.length-1;
  let rotatedMatrix=oldMatrix.map((row,i)=>  //for each row,
      row.map((val,j) =>  //for each element,
      direction=='CW'?oldMatrix[lenIndex - j][i]:oldMatrix[j][lenIndex - i]
      ));//assign new value according to the old position
  return rotatedMatrix;
}

// check to movement is valid
function isValidAction(matrix, cellRow, cellCol, downonly=false) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (downonly==true){
        if (matrix[row][col] && (cellRow + row >= playfield.length)){
          return false;
        }
      }
      if (matrix[row][col] && (// outside the game bounds
      cellCol + col < 0 ||//left boundary
      cellCol + col >= playfield[0].length ||//right boundary
      cellRow + row >= playfield.length ||//bottom boundary
      playfield[cellRow + row][cellCol + col])// collides with another piece
      ) {
      return false;
      }
    }
  }
  return true;
}

//only for swapping the onhold tetromino
function swaptetromino(tname){
  let temp = new prepTetromino(tname);
  return temp;
}

function hold(){
  canswap=false;
  let temp;
  if (onhold == null){
    onhold=display('hold',tetromino);
    tetromino=getTetromino();
    ptetromino=display('prev',null);
    drawTSHP('prev');
  }else{
    temp=tetromino;
    tetromino=swaptetromino(onhold.name);
    onhold=display('hold',temp);
  }
  shadowmino=locateShadow(tetromino);
  drawTSHP('hold');
}

// place the tetromino on the playfield
function placeTetromino(){
  stopstatus=false;
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (!playfield[0].every(each=>each==0)){
          return showGameOver();
        }
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // check for line clears starting from the bottom and working our way up
  let linesCleared=0;

  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {
      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }}
      linesCleared++;
    }
    else {
      row--;
    }
  }

  //level up
  linesClearedInLevel+=linesCleared;
  levelup=Math.floor(linesClearedInLevel/10);
  level+=levelup;
  linesClearedInLevel%=10;
  if (levelup){
    updateSpeed();
  }

  //update score
  if (linesCleared>=0){
    if (linesCleared==1){
      score+=40*(level+1);
    }else if (linesCleared==2){
      score+=100*(level+1);
    }else if (linesCleared==3){
      score+=300*(level+1);
    }else if (linesCleared==4){
      score+=1200*(level+1)
    }}
    
  //update new tetromino
  tetromino = getTetromino();
  canswap=true;
  shadowmino=locateShadow(tetromino);
  ptetromino=display('prev',null);
  drawTSHP('prev');
  showInfo();
  canhold=true;
}

//speed up with level
function updateSpeed(){
  if (level <= 8){
    framecount-=5;
  }else if (level==9){
    framecount=6;
  }else if (level<=21){
    frmaecount=Math.ceil((level-9)/3);
  }else if (level<=28){
    framecount=2;
  }else{
    framecount=1;
  }
}

// show the game over screen
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;
  document.getElementById("gameover").style.visibility = "visible";
}

//create the shadow object
function locateShadow(src){
  let lowestRow;
  let startRow = src.name=='I'?-1:-2;
  for (let row=startRow;row<playfield.length;row++){
    if(!isValidAction(src.matrix,row,src.col)){
      lowestRow=row-1;
      break;
  }}

  //deal with cantilever condition
  lowestRow=lowestRow>src.row?lowestRow:src.row;

  return {
    name: src.name,
    matrix: src.matrix,
    row: lowestRow,
    col: src.col
  }
}

function checkAgain(){
  if(isValidAction(tetromino.matrix, tetromino.row+1, tetromino.col,true)){
    stopstatus=false;
    clearTimeout(overtime);
    canhold=true;
  }
}

//drawing the active tetromino and shadow, and preview and hold
function drawTSHP(mode){
  let workingcontext,workingcanvas,working;
  working=mode=='prev'?ptetromino:mode=='hold'?onhold:mode=='tetromino'?tetromino:shadowmino;
  workingcontext=mode=='prev'?prevcontext:mode=='hold'?holdcontext:gamecontext;
  workingcanvas=mode=='prev'?prevcanvas:mode=='hold'?holdcanvas:null;
  let startcolpix = working.colpix, startrowpix = working.rowpix;

  if ((mode=='prev')||(mode=='hold')){
    workingcontext.clearRect(0,0,workingcanvas.width,workingcanvas.height);
    if (!((mode=='prev'&& ptetromino)||(mode=='hold'&& onhold))){
      return;
    }
    workingcontext.clearRect(0,0,workingcanvas.width,workingcanvas.height);
  }

  workingcontext.fillStyle = colors[working.name];
  for (let row = 0; row < working.matrix.length; row++) {
    for (let col = 0; col < working.matrix[row].length; col++) {
      if (working.matrix[row][col]) {
        if(mode=='prev'||mode=='hold'){
          workingcontext.fillRect(startcolpix + col * grid, startrowpix + row * grid, grid-grid_margin, grid-grid_margin);
        }
        else if(mode=='tetromino'){
          workingcontext.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-grid_margin, grid-grid_margin);
        }else if(mode=='shadowmino'){
          workingcontext.fillStyle = 'white';
          workingcontext.fillRect((shadowmino.col + col) * grid, (shadowmino.row + row) * grid, grid-grid_margin, grid-grid_margin);
          workingcontext.fillStyle='black';
          workingcontext.fillRect(((shadowmino.col + col) * grid)+2, ((shadowmino.row + row) * grid)+2, grid-5, grid-5);
  }}}}
}

function showInfo() {
  document.getElementById('score').innerHTML = 'Score: '+score;
  document.getElementById('level').innerHTML = 'Level: '+level;
}

//===============================================================================================================================================

const canvas = document.getElementById('game');
const gamecontext = canvas.getContext('2d');

const prevcanvas=document.getElementById('preview');
const prevcontext=prevcanvas.getContext('2d');

const holdcanvas=document.getElementById('store');
const holdcontext=holdcanvas.getContext('2d');


var playfield = [];

// initialize the game field
for (let row = -2; row < numofrow; row++) {
  playfield[row] = [];

  for (let col = 0; col < numofcol; col++) {
    playfield[row][col] = 0;
  }
}

var tetrominoQueue = [];
var count = 0;
var tetromino = getTetromino();
var ptetromino = display('prev',null);
var shadowmino = locateShadow(tetromino);
var level = 0;
var linesClearedInLevel=0;
var rAF = null;  // keep track of the animation frame so we can cancel it
var gameOver = false;
var stopstatus=false;
var framecount = framecountinit;
var score = 0;
var onhold=null;
var canswap=true;
var overtime;
var canhold=true;


showInfo();
drawTSHP('prev');

// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  gamecontext.clearRect(0,0,canvas.width,canvas.height);

  // draw the existing tetrominos
  for (let row = 0; row < numofrow; row++) {
    for (let col = 0; col < numofcol; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        gamecontext.fillStyle = colors[name];

        // drawing smaller than the actual size to draw the gap between grids
        gamecontext.fillRect(col * grid, row * grid, grid-grid_margin, grid-grid_margin);
      }
    }
  }

  if (tetromino) {
    if ( stopstatus == false ){
    // tetromino falls every [framecount]frames
    if (++count > framecount) {
      tetromino.row++;
      count = 0;
      // add to playfield if touched something below the tetromino
      if (!isValidAction(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        stopstatus=true;
        overtime=setTimeout(placeTetromino,lockdelay);
        canhold=false;
      }
    }
  }
  //draw active tetromino and shadow
  drawTSHP('shadowmino');
  drawTSHP('tetromino');
  }
}
// react to keyboard events
document.addEventListener('keydown', function(key) {
  if (gameOver) return;

  // left and right arrow keys (move)
  if (key.which === 37 || key.which === 39) {
    const col = key.which === 37? tetromino.col - 1 : tetromino.col + 1;
    if (isValidAction(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
      shadowmino=locateShadow(tetromino);
    }

    if (stopstatus){//check the location if movement within the lock delay
      checkAgain();
    }
  }

  // clockwise rotation(up arrow key)
  if (key.which === 38) {
    const matrix = rotate(tetromino.matrix,'CW');
    if (isValidAction(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
      shadowmino=locateShadow(tetromino);
    }

    if (stopstatus){
      checkAgain();
    }
  }

  // anticlockwise rotate(z key)
  if (key.which === 90) {
    const matrix = rotate(tetromino.matrix,'CCW');
    if (isValidAction(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
      shadowmino=locateShadow(tetromino);
    }
  }

  // down arrow key (soft drop)
  if (key.which === 40) {
    const row = tetromino.row + 1;
    if (!isValidAction(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;
      return;
    }
    tetromino.row = row;
  }

  // hard drop
  if (key.which===32){
    tetromino.row=shadowmino.row;
    count=34;
    placeTetromino();
    clearTimeout(overtime);
    canhold=true;
  }

  //if shift, hold
  if (key.which === 16 && canswap==true) {
    if(canhold){
      hold();
    }
  }
}
)

// start the game
rAF = requestAnimationFrame(loop);