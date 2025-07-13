var p1 = new player1();
var p2 = new player2();
var canvas = document.getElementById("pong_game");
canvas.width = 500;
canvas.height = 500;

class ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.xspeed = 3;
    this.yspeed = 2;
  }
  draw(ctx) {
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 5;
  }
  move(p1, p2) {
    if (
      this.x <= p1.x + p1.width &&
      !(this.y <= p1.y || this.y + this.height >= p1.y + p1.height)
    ) {
      this.xspeed *= -1;
    }

    if (
      this.x + this.width >= p2.x &&
      !(this.y <= p2.y || this.y + this.height >= p2.y + p2.height)
    ) {
      this.xspeed *= -1;
    }

    if (this.y <= 0 || this.y + this.height >= 500) {
      this.yspeed *= -1;
    }

    this.x += this.xspeed;
    this.y += this.yspeed;
  } // function of the touch of ball and player 1 2 (paddle) also the move of ball
}
