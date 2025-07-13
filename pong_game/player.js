class player1 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 50;
      this.speed = 10;
      this.up = false;
      this.down = false;
      document.addEventListener("keyup", this.keyUP.bind(this));
      document.addEventListener("keydown", this.KeyDown.bind(this));
    }
  
    draw(ctx) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowColor = "white";
      ctx.shadowBlur = 10;
      ctx.lineJoin = "bevel";
      ctx.lineWidth = 5;
    }
    move() {
      if (this.up && this.y > 10) {
        this.y -= this.speed;
      }
      if (this.down && this.y < 440) {
        this.y += this.speed;
      }
    }
  
    keyUP(exe) {
      if (exe.code == "KeyW") {
        this.up = false;
      } else if (exe.code == "KeyS") {
        this.down = false;
      }
    }
    KeyDown(exe) {
      if (exe.code == "KeyW") {
        this.up = true;
      } else if (exe.code == "KeyS") {
        this.down = true;
      }
    }
  }
  class player2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 50;
      this.speed = 10;
      this.up = false;
      this.down = false;
      document.addEventListener("keyup", this.keyUP.bind(this));
      document.addEventListener("keydown", this.KeyDown.bind(this));
    }
  
    draw(ctx) {
      ctx.strokeStyle = "rgb(78 4 177)";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "rgb(78 4 177)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowColor = "rgb(78 4 177)";
      ctx.shadowBlur = 10;
      ctx.lineJoin = "bevel";
      ctx.lineWidth = 5;
    }
    // avoid the player1 2 out of the map
    move() {
      if (this.up && this.y > 10) {
        this.y -= this.speed;
      }
      if (this.down && this.y < 440) {
        this.y += this.speed;
      }
    }
  
    keyUP(exe) {
      if (exe.code == "ArrowUp") {
        this.up = false;
      } else if (exe.code == "ArrowDown") {
        this.down = false;
      }
    }
    KeyDown(exe) {
      if (exe.code == "ArrowUp") {
        this.up = true;
      } else if (exe.code == "ArrowDown") {
        this.down = true;
      }
    }
  }